import { CardDeck, DrawedCard, Card } from "../types.js";
import { httpClient } from "../utils/http-client.js";
import { Guid } from "typescript-guid";
import { Channel, ChannelType } from "discord.js";
import discordClient from "../utils/discord-client-helper.js";

export class PokerGame {
  gameId: Guid;
  channelId: string = "";
  dealerId: string = "";
  userHands: UserHand[] = [];
  communityCards: Card[] = []; // new property for community cards

  private static SavedGames: SavedGame[];
  private baseUrl = "https://deckofcardsapi.com/api/";

  constructor(channelId: string, gameId: Guid = Guid.create()) {
    this.channelId = channelId;
    this.gameId = gameId;
  }

  public SetUser(
    userId: string,
    userName: string,
    cards: Card[],
    startingMoney: number
  ) {
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

    return "";
  }

  public async GetNewDeck(): Promise<string> {
    const response = await httpClient.Get<CardDeck>(
      `${this.baseUrl}deck/new/shuffle/?deck_count=1`
    );

    let deckId = "";

    if (response !== null && response !== undefined) {
      deckId = response.deck_id;
    }

    return deckId;
  }

  public async DrawCardsFromDeck(
    deckId: string,
    numberOfCards: number
  ): Promise<Card[]> {
    if (deckId === "") return new Array<Card>();

    const response = await httpClient.Get<DrawedCard>(
      `${this.baseUrl}deck/${deckId}/draw/?count=${numberOfCards}`
    );

    return response?.cards ?? new Array<Card>();
  }

  public GetCardImageUrl(cards: Card[]): string[] {
    const urls: string[] = new Array<string>();

    cards.forEach((element) => {
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
    const indexOfObject = PokerGame.SavedGames.findIndex((game) => {
      return game.gameId === gameId;
    });

    PokerGame.SavedGames.splice(indexOfObject, 1);
  }

  // Modified DealInitialCards: only deals community cards
  public async DealInitialCards(): Promise<void> {
    const deckId = await this.GetNewDeck();
    if (!deckId) return;
    // No longer dealing cards to each user; their hands are already set.
    this.communityCards = await this.DrawCardsFromDeck(deckId, 5);
  }

  // New method: evaluate winner (demo: random selection)
  private EvaluateWinner(): UserHand | null {
    if (this.userHands.length === 0) return null;
    const winnerIndex = Math.floor(Math.random() * this.userHands.length);
    return this.userHands[winnerIndex];
  }

  // New async method to play the game
  public async PlayGame(blind: number): Promise<void> {
    this.SaveGame(blind);
    await this.DealInitialCards();
    const channel = discordClient.client.channels.cache.get(
      this.channelId
    ) as Channel;
    if (channel && channel.isTextBased()) {
      if (channel.type === ChannelType.GuildText) {
        channel.send({ content: "Oyun başlıyor. Kartlar dağıtılıyor..." });
      }
    }
    // Evaluate winner (demo: random win)
    const winner = this.EvaluateWinner();
    if (winner && channel && channel.isTextBased()) {
      if (channel.type === ChannelType.GuildText) {
        channel.send({ content: `Kazanan: ${winner.userName}` });
      }
    }
  }

  // Modified StartGame to use the async PlayGame flow
  public StartGame(blind: number): void {
    this.PlayGame(blind);
  }
}

class SavedGame {
  gameId: Guid;
  channelId: string = "";
  dealerId: string = "";
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
