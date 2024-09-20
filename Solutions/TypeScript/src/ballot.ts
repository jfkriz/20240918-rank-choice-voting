export class Ballot {
    private id: string;
    private votes = new Map<string, number>();

    constructor(id: string, names: string[], ranks: number[]) {
        this.id = id;
        names.forEach((name, index) => {
            this.votes.set(name, ranks[index]);
        });
    }

    public getRank(name: string): number | undefined{
        return this.votes.get(name);
    }

    public getHighestRankedVote(): string {
        const highestRank = Math.min(...Array.from(this.votes.values()));
        return [...this.votes.entries()].find(entry => entry[1] === highestRank)?.[0] as string;
    }

    public eliminateCandidate(name: string): void {
        this.votes.delete(name);
    }
}