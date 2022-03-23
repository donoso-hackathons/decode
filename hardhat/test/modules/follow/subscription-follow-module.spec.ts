import '@nomiclabs/hardhat-ethers';
import { expect } from 'chai';

import { ZERO_ADDRESS } from '../../helpers/constants';
import { ERRORS } from '../../helpers/errors';
import { getTimestamp, matchEvent, waitForTx } from '../../helpers/utils';
import {
  abiCoder,
  subscriptionFollowModule,
  FIRST_PROFILE_ID,
  governance,
  lensHub,
  lensHubImpl,
  makeSuiteCleanRoom,
  MOCK_FOLLOW_NFT_URI,
  MOCK_PROFILE_HANDLE,
  MOCK_PROFILE_URI,
  user,
  userAddress,
  userTwo,
  userTwoAddress,
  userThreeAddress,
} from '../../__setup.spec';
import { FollowNFT, FollowNFT__factory } from '../../../typechain-types';

makeSuiteCleanRoom('Subscription Follow Module', function () {
  beforeEach(async function () {
    await expect(
      lensHub.createProfile({
        to: userAddress,
        handle: MOCK_PROFILE_HANDLE,
        imageURI: MOCK_PROFILE_URI,
        followModule: ZERO_ADDRESS,
        followModuleData: [],
        followNFTURI: MOCK_FOLLOW_NFT_URI,
      })
    ).to.not.be.reverted;
    await expect(
      lensHub.connect(governance).whitelistFollowModule(subscriptionFollowModule.address, true)
    ).to.not.be.reverted;
  });

  context('Negatives', function () {
    context('Initialization', function () {
      it('Initialize call should fail when sender is not the hub', async function () {
        await expect(
          subscriptionFollowModule.initializeFollowModule(FIRST_PROFILE_ID, [])
        ).to.be.revertedWith(ERRORS.NOT_HUB);
      });
    });

    context('Approvals', function () {
      // it('Approve should fail when calling it with addresses and toApprove params having different lengths', async function () {
      //   await expect(
      //     lensHub.setFollowModule(FIRST_PROFILE_ID, subscriptionFollowModule.address, [])
      //   ).to.not.be.reverted;
      //   await expect(
      //     subscriptionFollowModule.connect(user).approve(FIRST_PROFILE_ID, [userTwoAddress], [])
      //   ).to.be.revertedWith(ERRORS.INIT_PARAMS_INVALID);
      // });

      // it('Approve should fail when sender differs from profile owner', async function () {
      //   await expect(
      //     lensHub.setFollowModule(FIRST_PROFILE_ID, subscriptionFollowModule.address, [])
      //   ).to.not.be.reverted;
      //   await expect(
      //     subscriptionFollowModule.connect(userTwo).approve(FIRST_PROFILE_ID, [userTwoAddress], [false])
      //   ).to.be.revertedWith(ERRORS.NOT_PROFILE_OWNER);
      // });
    });

    context('Processing follow', function () {
      it('Process follow call should fail when sender is not the hub', async function () {
        await expect(
          subscriptionFollowModule.processFollow(userTwoAddress, FIRST_PROFILE_ID, [])
        ).to.be.revertedWith(ERRORS.NOT_HUB);
      });

      it('Follow should fail when follower address is not approved', async function () {
        await expect(
          lensHub.setFollowModule(FIRST_PROFILE_ID, subscriptionFollowModule.address, [])
        ).to.not.be.reverted;
        await expect(lensHub.connect(userTwo).follow([FIRST_PROFILE_ID], [[]])).to.be.revertedWith(
          ERRORS.FOLLOW_NOT_APPROVED
        );
      });

      it('Follow should fail when follower address approval is revoked after being approved', async function () {
        await expect(
          lensHub.setFollowModule(FIRST_PROFILE_ID, subscriptionFollowModule.address, [])
        ).to.not.be.reverted;
        await expect(
          subscriptionFollowModule.connect(user).cancelSubscription(FIRST_PROFILE_ID, userTwoAddress)
        ).to.not.be.reverted;
        await expect(lensHub.connect(userTwo).follow([FIRST_PROFILE_ID], [[]])).to.be.revertedWith(
          ERRORS.FOLLOW_NOT_APPROVED
        );
      });

      it('Follow should fail when follower address is not approved even when following itself', async function () {
        await expect(
          lensHub.setFollowModule(FIRST_PROFILE_ID, subscriptionFollowModule.address, [])
        ).to.not.be.reverted;
        await expect(lensHub.follow([FIRST_PROFILE_ID], [[]])).to.be.revertedWith(
          ERRORS.FOLLOW_NOT_APPROVED
        );
      });
    });
  });

  context.only('Scenarios', function () {
    context('Initialization', function () {
      it('Profile creation with initial approval data should emit expected event', async function () {
        const secondProfileId = FIRST_PROFILE_ID + 1;
        const data = abiCoder.encode(['address[]'], [[userTwoAddress]]);

        const tx = lensHub.createProfile({
          to: userAddress,
          handle: 'secondhandle',
          imageURI: MOCK_PROFILE_URI,
          followModule: subscriptionFollowModule.address,
          followModuleData: data,
          followNFTURI: MOCK_FOLLOW_NFT_URI,
        });

        const receipt = await waitForTx(tx);

        expect(receipt.logs.length).to.eq(2);
        matchEvent(receipt, 'Transfer', [ZERO_ADDRESS, userAddress, secondProfileId], lensHubImpl);
        matchEvent(receipt, 'ProfileCreated', [
          secondProfileId,
          userAddress,
          userAddress,
          'secondhandle',
          MOCK_PROFILE_URI,
          subscriptionFollowModule.address,
          data,
          MOCK_FOLLOW_NFT_URI,
          await getTimestamp(),
        ]);
      });

      it('Setting follow module should work when calling it without initial approval data', async function () {
        await expect(
          lensHub.setFollowModule(FIRST_PROFILE_ID, subscriptionFollowModule.address, [])
        ).to.not.be.reverted;
      });
    });

    context('subscriptions open/close and follows', function () {
      it('Open subscriptioon should emit expected event', async function () {
        const tx = subscriptionFollowModule
          .connect(user)
          .openSubscription(FIRST_PROFILE_ID, userTwoAddress);

        const receipt = await waitForTx(tx);

        expect(receipt.logs.length).to.eq(1);
        matchEvent(receipt, 'FollowsSubscription', [
          userAddress,
          FIRST_PROFILE_ID,
          userTwoAddress,
          true,
          await getTimestamp(),
        ]);
      });

      it.only('Cancel subscriptioon should emit expected event', async function () {
       
     await  lensHub.setFollowModule(FIRST_PROFILE_ID, subscriptionFollowModule.address, [])
  

      const openTx = subscriptionFollowModule.connect(user).openSubscription(FIRST_PROFILE_ID, userTwoAddress)
      await waitForTx(openTx);
       
      await lensHub.connect(userTwo).follow([FIRST_PROFILE_ID], [[]]);

        const tx = subscriptionFollowModule
          .connect(user)
          .cancelSubscription(FIRST_PROFILE_ID, userTwoAddress);

        const receipt = await waitForTx(tx);

        expect(receipt.logs.length).to.eq(1);
        matchEvent(receipt, 'FollowsSubscription', [
          userAddress,
          FIRST_PROFILE_ID,
          userTwoAddress,
          false,
          await getTimestamp(),
        ]);
      });

      it('Follow call should work when address was previously approved', async function () {
        await expect(
          lensHub.setFollowModule(FIRST_PROFILE_ID, subscriptionFollowModule.address, [])
        ).to.not.be.reverted;
        await expect(
          subscriptionFollowModule.connect(user).openSubscription(FIRST_PROFILE_ID, userTwoAddress)
        ).to.not.be.reverted;
        await expect(lensHub.connect(userTwo).follow([FIRST_PROFILE_ID], [[]])).to.not.be.reverted;


        const followNFT = FollowNFT__factory.connect(
          await lensHub.getFollowNFT(FIRST_PROFILE_ID),
          userTwo
        );
       // await expect(followNFT.burn(1)).to.not.be.reverted;
        
        console.log(await followNFT.ownerOf(1))
        console.log(await followNFT.balanceOf(userTwoAddress))

      });

      it('Follow call to self should work when address was previously approved', async function () {
        await expect(
          lensHub.setFollowModule(FIRST_PROFILE_ID, subscriptionFollowModule.address, [])
        ).to.not.be.reverted;
        await expect(
          subscriptionFollowModule.connect(user).openSubscription(FIRST_PROFILE_ID, userAddress)
        ).to.not.be.reverted;
        await expect(lensHub.follow([FIRST_PROFILE_ID], [[]])).to.not.be.reverted;
      });
    });

    context('View Functions', function () {
      beforeEach(async function () {
        await expect(
          lensHub.setFollowModule(FIRST_PROFILE_ID, subscriptionFollowModule.address, [])
        ).to.not.be.reverted;
       await subscriptionFollowModule.connect(user).openSubscription(FIRST_PROFILE_ID, userTwoAddress)

      });

      it('Single approval getter should return expected values', async function () {
        expect(
          await subscriptionFollowModule.hasSubscription(FIRST_PROFILE_ID, userTwoAddress)
        ).to.eq(true);

        expect(
          await subscriptionFollowModule.hasSubscription(FIRST_PROFILE_ID,userThreeAddress)
        ).to.eq(false);
      });

    });
  });
});
