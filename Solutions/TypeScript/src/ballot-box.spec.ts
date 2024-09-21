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
        createTestCase("test-02-no-initial-majority-candidate"),
        createTestCase("test-03-multiple-rounds-of-elimination"),
        createTestCase("test-04-exhausted-ballot"),
        createTestCase("test-05-no-majority--all-candidates-eliminated-except-one"),
        createTestCase("test-06-duplicate-rankings"),
        createTestCase("test-07-skipped-rankings"),
    ];

    function createTestCase(testCase: string): TestCase {
        const fixture = new BallotBox(fs.readFileSync(`${testCasesDir}/${testCase}/cvr.csv`, "utf-8").trim().split('\n'));
        const expectedWinner = fs.readFileSync(`${testCasesDir}/${testCase}/expect_results_summary.csv`, "utf-8")
            .trim()
            .split('\n')
            .find((line) => line.startsWith("Elected"))?.replace("Elected,", "")?.replace(/,/g, "")?.trim() as string;

        return { name: testCase, expectedWinner, fixture };
    }

    test.each(testCases)("instantRunoffWinner should return $expectedWinner as the winner for $name", (testCase) => {
        const winner = testCase.fixture.instantRunoffWinner();
        expect(winner).toEqual(testCase.expectedWinner);
    });
});


