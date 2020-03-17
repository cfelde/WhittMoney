# WhittMoney

Whitt.Money has been built during ETHLondon 2020 hackathon, and later refactored and improved.

In short it's an interest rate swap contract with a few twists.

The name is a commemoration of Richard **Whitt**ington, Lord Mayor of London, the real-life inspiration for the tale _Dick Whittington and His Cat_. Medieval entrepreneur, hacker, and philanthropist. Citing Wikipedia: "In his lifetime he financed a number of public projects, such as drainage systems in poor areas of medieval London, and a hospital ward for unmarried mothers. He bequeathed his fortune to form the Charity of Sir Richard Whittington which, nearly 600 years later, continues to assist people in need." 

## Inspiration

Meet John. John's laptop broke and he needs some cash to get a new one. He has some savings but he's not touching it, that's for his retirement. So what are Joe's options?
- use his savings (Nah, if he touches it once, there’s an easy way to spend it all one day)
- get a loan and pay interest (Nah, he does have money, paying extra doesn't make sense)	
- put his savings into Compound and wait until it brings enough money (Nah, he needs it now, not in a year)
- or just Whitt it!

## What it does

What is Whitt? It's another cool DeFi money lego! It allows anyone to get an upfront, fixed interest rate earnings on their locked collateral. Counterparty can buy future interest from this collateral for a specified fixed amount. It's just a trustless interest rate swap, but much simpler and more useful than before.

Say John can lock $100K in DAI for a year. The current Compound supply interest rate is ~8.00%, so John can potentially get $8k DAI in a year, assuming that the rate won't change (it will!). So he's ok with getting a bit less, say 6% interest if the interest rate is fixed and he gets money right away. 

Now let's say that some Richard is willing to pay $6.25K in DAI right now to profit on John's Compound for a year. Richard takes risk of Compound rate change and provides John with instant money. If Compound rate stays on average at 8% Richard gets $8K - $1.75K profit on his $6.25K investment (28%). If Compound rate increases, his profit will be even higher and even if the rate goes down, he still gets some of the money back.

## How we built it

We use rDAI to keep lenders' collateral. Until someone pays the lenders' desired upfront fixed fee, the interest goes to the lender. Once the upfront fixed fee is provided to the contract, it forwards it to the lender and sets interest receiver to the contract that paid the fee, locking the collateral for a given period (a year by default right now). Once the lockdown period ends, the lender can get his collateral back.
