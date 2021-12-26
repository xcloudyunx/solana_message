const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

describe("solana_message", () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SolanaMessage;
  
  it("It initializes the account", async () => {
    const baseAccount = anchor.web3.Keypair.generate();

    await program.rpc.initialize("Hello World", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Data: ', account.dataList.at(-1));
    assert.ok(account.dataList.at(-1) === "Hello World");
    _baseAccount = baseAccount;
  });

  it("Updates a previously created account", async () => {
    const baseAccount = _baseAccount;

    await program.rpc.update("Some new data", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Updated data: ', account.dataList.at(-1))
    assert.ok(account.data === "Some new data");
    console.log('all account data:', account)
    console.log('All data: ', account.dataList);
    assert.ok(account.dataList.length === 2);
  });
});