import {
  MobileAds,
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Your rewarded ad unit ID
// const AD_UNIT_ID = __DEV__
//   ? TestIds.REWARDED // Use test ID in development
//   : 'ca-app-pub-8013532435881465/8453000156'; // Your actual ad unit ID
const AD_UNIT_ID = 'ca-app-pub-8013532435881465/8453000156';

class RewardedAdService {
  private rewarded: RewardedAd | null = null;
  private isLoading: boolean = false;
  private isLoaded: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Check if MobileAds is available
      console.log('Checking MobileAds availability...', typeof MobileAds, MobileAds);
      
      if (!MobileAds || typeof MobileAds !== 'function') {
        console.error('MobileAds is not available or not a function. Native module may not be linked properly.');
        return;
      }

      console.log('Initializing Mobile Ads SDK...');
      
      // MobileAds is a function that returns the instance
      const adsInstance = MobileAds();
      
      if (!adsInstance) {
        console.error('Failed to get ads instance from MobileAds()');
        return;
      }

      console.log('Got ads instance:', adsInstance);

      if (typeof adsInstance.initialize === 'function') {
        await adsInstance.initialize();
        console.log('✅ Mobile Ads SDK initialized successfully');
      } else {
        console.warn('initialize method not found on ads instance, proceeding anyway...');
      }
      
      this.isInitialized = true;

      // Create the rewarded ad after initialization
      console.log('Creating rewarded ad with ID:', AD_UNIT_ID);
      this.rewarded = RewardedAd.createForAdRequest(AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing Mobile Ads SDK:', error);
      console.error('Error details:', error?.message || error);
      console.error('Error stack:', error?.stack);
    }
  }

  private setupEventListeners() {
    if (!this.rewarded) {
      console.warn('Rewarded ad not initialized yet');
      return;
    }

    try {
      console.log('Setting up event listeners...');

      // Use string literals directly (from enum definitions)
      // RewardedAdEventType.LOADED = 'rewarded_loaded'
      // RewardedAdEventType.EARNED_REWARD = 'rewarded_earned_reward'
      // AdEventType.ERROR = 'error'
      // AdEventType.CLOSED = 'closed'

      // Listen for ad loaded event
      this.rewarded.addAdEventListener('rewarded_loaded', () => {
        console.log('✅ Rewarded ad loaded successfully');
        this.isLoaded = true;
        this.isLoading = false;
      });

      // Listen for ad error
      this.rewarded.addAdEventListener('error', error => {
        console.error('❌ Rewarded ad error:', error);
        console.error('Error code:', error?.code);
        console.error('Error message:', error?.message);
        this.isLoading = false;
        this.isLoaded = false;
      });

      // Listen for user earned reward
      this.rewarded.addAdEventListener('rewarded_earned_reward', reward => {
        console.log('🎉 User earned reward:', reward);
      });

      // Listen for ad closed
      this.rewarded.addAdEventListener('closed', () => {
        console.log('Ad closed, reloading for next time...');
        this.isLoaded = false;
        this.load();
      });

      console.log('✅ Event listeners set up successfully');

      // Load the ad initially
      console.log('Starting initial ad load...');
      this.load();
    } catch (error) {
      console.error('❌ Error setting up event listeners:', error);
      console.error('Error details:', error?.message);
    }
  }

  async load() {
    if (!this.isInitialized || !this.rewarded) {
      console.warn('⚠️ Ads SDK not initialized yet, cannot load ad');
      return;
    }

    if (this.isLoading || this.isLoaded) {
      console.log('Ad already loading or loaded, skipping...');
      return;
    }

    try {
      console.log('🔄 Loading rewarded ad...');
      this.isLoading = true;
      await this.rewarded.load();
      console.log('Ad load request sent');
    } catch (error) {
      console.error('❌ Error loading rewarded ad:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      this.isLoading = false;
    }
  }

  async show(): Promise<boolean> {
    if (!this.isInitialized || !this.rewarded) {
      console.warn('Ads SDK not initialized yet');
      return false;
    }

    try {
      if (!this.isLoaded) {
        console.log('Ad not loaded yet, loading now...');
        await this.load();
        // Wait a bit for the ad to load
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (this.isLoaded && this.rewarded) {
        await this.rewarded.show();
        this.isLoaded = false;
        // Load the next ad
        this.load();
        return true;
      } else {
        console.warn('Rewarded ad is not ready');
        return false;
      }
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      this.isLoaded = false;
      this.load(); // Try to load again
      return false;
    }
  }

  getLoadedStatus(): boolean {
    return this.isLoaded;
  }
}

// Export a singleton instance with error handling
let _rewardedAdServiceInstance: RewardedAdService | null = null;

function getRewardedAdService(): RewardedAdService {
  if (!_rewardedAdServiceInstance) {
    try {
      _rewardedAdServiceInstance = new RewardedAdService();
    } catch (error) {
      console.error('Failed to create RewardedAdService:', error);
      // Return a mock service that won't crash
      _rewardedAdServiceInstance = {
        getLoadedStatus: () => false,
        show: async () => false,
        load: async () => {},
      } as any;
    }
  }
  return _rewardedAdServiceInstance;
}

export const rewardedAdService = getRewardedAdService();

