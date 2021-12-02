exports.id = 0;
exports.modules = {

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsService = void 0;
const common_1 = __webpack_require__(11);
const typeorm_1 = __webpack_require__(13);
const typeorm_2 = __webpack_require__(20);
const ChannelChats_1 = __webpack_require__(21);
const ChannelMembers_1 = __webpack_require__(23);
const Channels_1 = __webpack_require__(22);
const Users_1 = __webpack_require__(19);
const Workspaces_1 = __webpack_require__(24);
const events_gateway_1 = __webpack_require__(50);
let ChannelsService = class ChannelsService {
    constructor(channelsRepository, channelMembersRepository, workspacesRepository, channelChatsRepository, usersRepository, eventsGateway) {
        this.channelsRepository = channelsRepository;
        this.channelMembersRepository = channelMembersRepository;
        this.workspacesRepository = workspacesRepository;
        this.channelChatsRepository = channelChatsRepository;
        this.usersRepository = usersRepository;
        this.eventsGateway = eventsGateway;
    }
    async findById(id) {
        return this.channelsRepository.findOne({ where: { id } });
    }
    async getWorkspaceChannels(url, myId) {
        return this.channelsRepository
            .createQueryBuilder('channels')
            .innerJoinAndSelect('channels.ChannelMembers', 'channelMembers', 'channelMembers.userId = :myId', { myId })
            .innerJoinAndSelect('channels.Workspace', 'workspace', 'workspace.url = :url', { url })
            .getMany();
    }
    async getWorkspaceChannel(url, name) {
        return this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
    }
    async createWorkspaceChannels(url, name, myId) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
        const channel = new Channels_1.Channels();
        channel.name = name;
        channel.WorkspaceId = workspace.id;
        const channelReturned = await this.channelsRepository.save(channel);
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.UserId = myId;
        channelMember.ChannelId = channelReturned.id;
        await this.channelMembersRepository.save(channelMember);
    }
    async getWorkspaceChannelMembers(url, name) {
        return this.usersRepository
            .createQueryBuilder('user')
            .innerJoin('user.Channels', 'channels', 'channels.name = :name', {
            name,
        })
            .innerJoin('channels.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .getMany();
    }
    async createWorkspaceChannelMembers(url, name, email) {
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
        if (!channel) {
            return null;
        }
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .innerJoin('user.Workspaces', 'workspace', 'workspace.url = :url', {
            url,
        })
            .getOne();
        if (!user) {
            return null;
        }
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.ChannelId = channel.id;
        channelMember.UserId = user.id;
        await this.channelMembersRepository.save(channelMember);
    }
    async getWorkspaceChannelChats(url, name, perPage, page) {
        return this.channelChatsRepository
            .createQueryBuilder('channelChats')
            .innerJoin('channelChats.Channel', 'channel', 'channel.name = :name', {
            name,
        })
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .innerJoinAndSelect('channelChats.User', 'user')
            .orderBy('channelChats.createdAt', 'DESC')
            .take(perPage)
            .skip(perPage * (page - 1))
            .getMany();
    }
    async createWorkspaceChannelChats(url, name, content, myId) {
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
        const chats = new ChannelChats_1.ChannelChats();
        chats.content = content;
        chats.UserId = myId;
        chats.ChannelId = channel.id;
        const savedChat = await this.channelChatsRepository.save(chats);
        const chatWithUser = await this.channelChatsRepository.findOne({
            where: { id: savedChat.id },
            relations: ['User', 'Channel'],
        });
        this.eventsGateway.server
            .to(`/ws-${url}-${chatWithUser.ChannelId}`)
            .emit('message', chatWithUser);
    }
    async createWorkspaceChannelImages(url, name, files, myId) {
        console.log(files);
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
        for (let i = 0; i < files.length; i++) {
            const chats = new ChannelChats_1.ChannelChats();
            chats.content = files[i].path;
            chats.UserId = myId;
            chats.ChannelId = channel.id;
            const savedChat = await this.channelChatsRepository.save(chats);
            const chatWithUser = await this.channelChatsRepository.findOne({
                where: { id: savedChat.id },
                relations: ['User', 'Channel'],
            });
            this.eventsGateway.server
                .to(`/ws-${url}-${chatWithUser.ChannelId}`)
                .emit('message', chatWithUser);
        }
    }
    async getChannelUnreadsCount(url, name, after) {
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
        return this.channelChatsRepository.count({
            where: {
                ChannelId: channel.id,
                createdAt: typeorm_2.MoreThan(new Date(after)),
            },
        });
    }
};
ChannelsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Channels_1.Channels)),
    __param(1, typeorm_1.InjectRepository(ChannelMembers_1.ChannelMembers)),
    __param(2, typeorm_1.InjectRepository(Workspaces_1.Workspaces)),
    __param(3, typeorm_1.InjectRepository(ChannelChats_1.ChannelChats)),
    __param(4, typeorm_1.InjectRepository(Users_1.Users)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof events_gateway_1.EventsGateway !== "undefined" && events_gateway_1.EventsGateway) === "function" ? _f : Object])
], ChannelsService);
exports.ChannelsService = ChannelsService;


/***/ })

};