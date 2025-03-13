/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/flipsonicprogram.json`.
 */
export type Flipsonicprogram = {
    "address": "edJUEE32ixRxvoiCfVD9Svo5yaSrTNrgxrYDfEVyo1Q",
    "metadata": {
      "name": "flipsonicprogram",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "addLiquidity",
        "discriminator": [
          181,
          157,
          89,
          67,
          143,
          182,
          52,
          72
        ],
        "accounts": [
          {
            "name": "pool",
            "writable": true
          },
          {
            "name": "liquidityTokenMint",
            "writable": true
          },
          {
            "name": "userLiquidityTokenAccount",
            "writable": true
          },
          {
            "name": "userTokenA",
            "writable": true
          },
          {
            "name": "userTokenB",
            "writable": true
          },
          {
            "name": "poolTokenA",
            "writable": true
          },
          {
            "name": "poolTokenB",
            "writable": true
          },
          {
            "name": "user",
            "signer": true
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "rent",
            "address": "SysvarRent111111111111111111111111111111111"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "associatedTokenProgram",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "amountA",
            "type": "u128"
          },
          {
            "name": "amountB",
            "type": "u128"
          },
          {
            "name": "poolBump",
            "type": "u8"
          }
        ]
      },
      {
        "name": "initializePool",
        "discriminator": [
          95,
          180,
          10,
          172,
          84,
          174,
          232,
          40
        ],
        "accounts": [
          {
            "name": "pool",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    111,
                    111,
                    108
                  ]
                },
                {
                  "kind": "account",
                  "path": "mintA"
                },
                {
                  "kind": "account",
                  "path": "mintB"
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "mintA"
          },
          {
            "name": "mintB"
          },
          {
            "name": "liquidityTokenMint",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    111,
                    111,
                    108
                  ]
                },
                {
                  "kind": "account",
                  "path": "pool"
                }
              ]
            }
          },
          {
            "name": "user",
            "writable": true,
            "signer": true
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          }
        ],
        "args": [
          {
            "name": "poolBump",
            "type": "u8"
          },
          {
            "name": "fee",
            "type": "u16"
          }
        ]
      },
      {
        "name": "removeLiquidity",
        "discriminator": [
          80,
          85,
          209,
          72,
          24,
          206,
          177,
          108
        ],
        "accounts": [
          {
            "name": "pool",
            "writable": true
          },
          {
            "name": "liquidityTokenMint",
            "writable": true
          },
          {
            "name": "userTokenA",
            "writable": true
          },
          {
            "name": "userTokenB",
            "writable": true
          },
          {
            "name": "poolTokenA",
            "writable": true
          },
          {
            "name": "poolTokenB",
            "writable": true
          },
          {
            "name": "userLiquidityTokenAccount",
            "writable": true
          },
          {
            "name": "user",
            "signer": true
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          }
        ],
        "args": [
          {
            "name": "liquidityTokens",
            "type": "u128"
          },
          {
            "name": "poolBump",
            "type": "u8"
          }
        ]
      },
      {
        "name": "swap",
        "discriminator": [
          248,
          198,
          158,
          145,
          225,
          117,
          135,
          200
        ],
        "accounts": [
          {
            "name": "pool",
            "writable": true
          },
          {
            "name": "userTokenIn",
            "writable": true
          },
          {
            "name": "userTokenOut",
            "writable": true
          },
          {
            "name": "poolTokenIn",
            "writable": true
          },
          {
            "name": "poolTokenOut",
            "writable": true
          },
          {
            "name": "user",
            "signer": true
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          }
        ],
        "args": [
          {
            "name": "amountIn",
            "type": "u128"
          },
          {
            "name": "minAmountOut",
            "type": "u128"
          },
          {
            "name": "poolBump",
            "type": "u8"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "pool",
        "discriminator": [
          241,
          154,
          109,
          4,
          17,
          177,
          109,
          188
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "slippageExceeded",
        "msg": "Slippage exceeded"
      },
      {
        "code": 6001,
        "name": "invalidTokenAmount",
        "msg": "Invalid Token Amount"
      },
      {
        "code": 6002,
        "name": "invalidRatio",
        "msg": "In Balance amount"
      },
      {
        "code": 6003,
        "name": "mathError",
        "msg": "Math error"
      },
      {
        "code": 6004,
        "name": "wrongPool",
        "msg": "Wrong Pool"
      }
    ],
    "types": [
      {
        "name": "pool",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "mintA",
              "type": "pubkey"
            },
            {
              "name": "mintB",
              "type": "pubkey"
            },
            {
              "name": "owner",
              "type": "pubkey"
            },
            {
              "name": "reserveA",
              "type": "u128"
            },
            {
              "name": "reserveB",
              "type": "u128"
            },
            {
              "name": "fee",
              "type": "u16"
            },
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "liquidityTokenMint",
              "type": "pubkey"
            },
            {
              "name": "totalLiquidity",
              "type": "u128"
            }
          ]
        }
      }
    ]
  };
  