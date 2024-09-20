import { BallotBox } from "./ballot-box";
import fs from 'fs';

describe("BallotBox", () => {
    type TestCase = {
        name: string;
        expectedWinner: string;
        fixture: BallotBox;
    };
    const testCasesDir = `${__dirname}/../../../test-elections`;
    const testCases = [
        createTestCase("test-01-basic-majority"),
        createTestCase("test-02-no-initial-majority-candidate")
    ];

    function createTestCase(testCase: string): TestCase {
        const fixture = new BallotBox(fs.readFileSync(`${testCasesDir}/${testCase}/cvr.csv`, "utf-8").trim().split('\n'));
        const expectedWinner = fs.readFileSync(`${testCasesDir}/${testCase}/expect_results_summary.csv`, "utf-8")
            .trim()
            .split('\n')
            .find((line) => line.startsWith("Elected"))?.replace("Elected,", "")?.replace(/,/g, "")?.trim() as string;

        return { name: testCase, expectedWinner, fixture };
    }

    test.each(testCases)("should return $expectedWinner as the winner for $name", (testCase) => {
        const winner = testCase.fixture.getWinningCandidate();
        expect(winner).toBe(testCase.expectedWinner);
    });
});


