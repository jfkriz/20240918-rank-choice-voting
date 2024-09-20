import fs from 'fs';
import { Ballot } from './ballot';

export class BallotBox {
    private candidates: Array<string>;
    private ballots: Array<Ballot>;

    constructor(lines: string[]) {
        const header = lines[0].split(",");
        
        this.candidates = header.slice(1);

        lines.shift();

        this.ballots = lines.map((line) => {
            const values = line.split(",");
            const id = values[0];
            values.shift();
            return new Ballot(id, this.candidates, values.map((value) => parseInt(value)));
        });
    }

    public getRankings(): Map<string, number> {
        const rankings = new Map<string, number>();
        this.candidates.forEach((candidate) => {
            rankings.set(candidate, 0);
        });

        this.ballots.forEach((ballot) => {
            const highestRankedCandidate = ballot.getHighestRankedVote();
            rankings.set(highestRankedCandidate, rankings.get(highestRankedCandidate)! + 1);
        });

        const ballotCount = this.ballots.length;
        return new Map([...rankings].map(([candidate, votes]) => [candidate, votes / ballotCount]));
    }

    public getWinningCandidate(): string {
        const rankings = this.getRankings();
        const winner = [...rankings.entries()].reduce((a, e) => e[1] > a[1] ? e : a);
        return winner[0];
    }
}
