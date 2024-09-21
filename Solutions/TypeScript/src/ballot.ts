export class Ballot {
    private id: string;
    private votes = new Map<string, number>();

    /**
     * Create a new ballot. The given names and ranks arrays must be the same length. This does not verify that.
     * @param id the id of the ballot
     * @param names the names of the candidates
     * @param ranks the ranks of the candidates
     * @returns 
     */
    constructor(id: string, names: string[], ranks: number[]) {
        this.id = id;
        // Check for duplicate rankings - but there may be one or more NaNs in the ranks array, 
        // which are not considered duplicates, those are just skipped votes.
        const filteredRanks = ranks.filter(rank => !Number.isNaN(rank) && rank > 0);
        if(new Set<number>(filteredRanks).size !== filteredRanks.length) {
            return;
        }

        // Only add names with valid (number > 0) ranks to the votes map.
        names.forEach((name, index) => {
            const rank = ranks[index];
            if(!Number.isNaN(rank) && rank > 0) {
                this.votes.set(name, ranks[index]);
            }
        });
    }

    /**
     * Get the name of the candidate with the highest rank on the ballot.
     * @returns The name of the candidate with the highest rank on the ballot.
     */
    public getHighestRankedVote(): string {
        const highestRank = Math.min(...Array.from(this.votes.values()));
        return [...this.votes.entries()].find(entry => entry[1] === highestRank)?.[0] as string;
    }

    /**
     * Remove a candidate from the ballot.
     * @param name The name of the candidate to eliminate from the ballot.
     */
    public eliminateCandidate(name: string): void {
        this.votes.delete(name);
    }

    /**
     * Create a deep copy of the ballot.
     * @returns A deep copy of the ballot.
     */
    public clone = (): Ballot => new Ballot(this.id, Array.from(this.votes.keys()), Array.from(this.votes.values()));
}