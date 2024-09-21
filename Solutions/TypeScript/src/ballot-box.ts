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

    /**
     * Calculate the rankings of the candidates based on the ballots.
     * @param candidates the candidates currently being considered
     * @param ballots the ballots to be counted
     * @returns the rankings of the candidates, as a map from candidate name to the proportion of votes they received
     */
    private getRankings(candidates: Array<string>, ballots: Array<Ballot>): Map<string, number> {
        const rankings = new Map<string, number>();
        candidates.forEach((candidate) => {
            rankings.set(candidate, 0);
        });

        ballots.forEach((ballot) => {
            const highestRankedCandidate = ballot.getHighestRankedVote();
            rankings.set(highestRankedCandidate, rankings.get(highestRankedCandidate)! + 1);
        });

        const ballotCount = ballots.length;
        return new Map([...rankings].map(([candidate, votes]) => [candidate, votes / ballotCount]));
    }

    /**
     * Calculate the winner of the election using instant runoff voting. If no candidate has a majority of the votes,
     * the candidate with the fewest votes is eliminated and the process is repeated until a candidate has a majority,
     * or only one candidate remains.
     * @returns the winner of the election, as determined by instant runoff voting
     */
    public instantRunoffWinner(): string {
        const remainingCandidates = [...this.candidates];
        const ballots = [...this.ballots.map((ballot) => ballot.clone())];
        while(remainingCandidates.length > 1) {
            const rankings = this.getRankings(remainingCandidates, ballots);
            const winner = [...rankings.entries()].find((entry) => entry[1] > 0.5);
            if(winner) {
                return winner[0];
            }
            const loser = [...rankings.entries()].reduce((a, e) => e[1] < a[1] ? e : a);
            ballots.forEach((ballot) => {
                ballot.eliminateCandidate(loser[0]);
            });
            remainingCandidates.splice(remainingCandidates.indexOf(loser[0]), 1);
        }
        return remainingCandidates[0];
    }
}
