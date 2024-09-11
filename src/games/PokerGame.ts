import { CardDeck, DrawedCard, Card } from "../types";
import { HttpClient } from "../httpClient";
import { Guid } from "typescript-guid";
import { Channel, ChannelType } from "discord.js";
import discordClient from "../discord_client_helper";

export class PokerGame {
    gameId: Guid;
    channelId: string = '';
    dealerId: string = '';
    userHands: UserHand[] = [];

    private static SavedGames: SavedGame[];
    private static httpClient = new HttpClient();
    private baseUrl = 'https://deckofcardsapi.com/api/';

    constructor(channelId: string, gameId: Guid = Guid.create()) {
        this.channelId = channelId;
        this.gameId = gameId;
    }

    public SetUser(userId: string, userName: string, cards: Card[], startingMoney: number) {
        const userHand = new UserHand(userId, userName, startingMoney, cards);

        this.userHands.push(userHand);
    }

    public SetDealer(): string {
        if (this.userHands.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.userHands.length);
            const usr = this.userHands[randomIndex];
            this.dealerId = usr.userId;
            return usr.userName;
        }

        return '';
    }

    public async GetNewDeck(): Promise<string> {
        const response = await PokerGame.httpClient.Get<CardDeck>(`${this.baseUrl}deck/new/shuffle/?deck_count=1`);

        let deckId = '';

        if (response !== null)
            deckId = response.deck_id;

        return deckId;
    }

    public async DrawCardsFromDeck(deckId: string, numberOfCards: number): Promise<Card[]> {
        if (deckId === '')
            return new Array<Card>();

        const response = await PokerGame.httpClient.Get<DrawedCard>(`${this.baseUrl}deck/${deckId}/draw/?count=${numberOfCards}`);

        return response?.cards ?? new Array<Card>();
    }

    public GetCardImageUrl(cards: Card[]): string[] {
        const urls: string[] = new Array<string>();

        cards.forEach(element => {
            urls.push(element.image);
        });

        return urls;
    }

    private SaveGame(blind: number): void {
        const game = new SavedGame(this.gameId);
        game.channelId = this.channelId;
        game.blind = blind;
        game.bigBlind = blind * 2;
        game.dealerId = this.dealerId;
        game.users = this.userHands;

        if (!PokerGame.SavedGames) {
            PokerGame.SavedGames = [];
        }

        PokerGame.SavedGames.push(game);
    }

    public DeleteGame(gameId: Guid): void {
        const indexOfObject = PokerGame.SavedGames.findIndex(game => {
            return game.gameId === gameId;
        });

        PokerGame.SavedGames.splice(indexOfObject, 1);
    }

    public StartGame(blind: number): void {
        this.SaveGame(blind);
        //TODO needs abstraction, discord specific methods needs to go
        const channel = discordClient.client.channels.cache.get(this.channelId) as Channel;

        if (channel.isTextBased()) {
            if (channel.type == ChannelType.GuildText)  {
                channel.send({ content: 'Oyun basliyor...' });
            }
        }

        // client.users.send('358669734130089995', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    }
}

class SavedGame {
    gameId: Guid;
    channelId: string = '';
    dealerId: string = '';
    blind: number = 0;
    bigBlind: number = 0;
    cards: Card[] = [];
    users: UserHand[] = [];

    constructor(gameId: Guid) {
        this.gameId = gameId;
    }
}

class UserHand {
    userId: string;
    userName: string;
    money: number;
    cards: Card[];

    constructor(userId: string, userName: string, money: number, cards: Card[]) {
        this.userId = userId;
        this.userName = userName;
        this.money = money;
        this.cards = cards;
    }
}