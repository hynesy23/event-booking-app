const chai = require("chai");
const { expect } = require("chai");
const { dateToString } = require("../utils/dates");

describe("dateToString", () => {
  it("Returns new Date into string", () => {
    const input = new Date();
    const actualResult = dateToString(input);
    expect(actualResult).to.be.a("string");
  });
});
