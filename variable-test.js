

async function run() {
  let hash = {}
  hash["myTest"] = "MY TEST WORKS"
  testVar(hash)
  console.log(hash)
}

async function testVar(myHash) {
  myHash["test123"] = "HOW ABOUT NOW??"
}

run();
