import {
  MobileAds,
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Ad Unit IDs
// const REWARDED_AD_UNIT_ID = __DEV__
//   ? TestIds.REWARDED
//   : 'ca-app-pub-8013532435881465/8453000156';
const REWARDED_AD_UNIT_ID ='ca-app-pub-8013532435881465/8453000156';
class AdService {
  private rewardedAd: RewardedAd | null = null;
  private isLoaded: boolean = false;
  private isLoading: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Log which ad unit ID is being used (helpful for debugging)
      console.log('🎯 AdService: Initializing with ad unit ID:', REWARDED_AD_UNIT_ID);
      console.log('🎯 AdService: __DEV__ =', __DEV__);
      
      if (!MobileAds || typeof MobileAds !== 'function') {
        console.error('❌ MobileAds not available');
        return;
      }

      const adsInstance = MobileAds();
      if (!adsInstance) {
        console.error('❌ MobileAds instance is null');
        return;
      }

      console.log('🔄 AdService: Initializing MobileAds SDK...');
      await adsInstance.initialize();
      console.log('✅ AdService: MobileAds SDK initialized');
      this.isInitialized = true;

      // Create rewarded ad
      console.log('🔄 AdService: Creating rewarded ad with ID:', REWARDED_AD_UNIT_ID);
      this.rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('❌ Error initializing AdService:', error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
    }
  }

  private setupEventListeners() {
    if (!this.rewardedAd) return;

    // Use string literals (as per react-native-google-mobile-ads API)
    // Listen for ad loaded event
    this.rewardedAd.addAdEventListener('rewarded_loaded', () => {
      console.log('✅ Rewarded ad loaded successfully');
      this.isLoaded = true;
      this.isLoading = false;
    });

    // Listen for ad error
    this.rewardedAd.addAdEventListener('error', (error: any) => {
      console.error('❌ Rewarded ad error:', error);
      // Log more details about the error
      if (error?.code) {
        console.error('Error code:', error.code);
      }
      if (error?.message) {
        console.error('Error message:', error.message);
      }
      if (error?.domain) {
        console.error('Error domain:', error.domain);
      }
      this.isLoading = false;
      this.isLoaded = false;
      
      // Retry loading after error (wait 5 seconds before retry)
      // This helps recover from temporary errors
      setTimeout(() => {
        console.log('🔄 Retrying ad load after error...');
        this.load();
      }, 5000);
    });

    // Listen for user earned reward
    this.rewardedAd.addAdEventListener('rewarded_earned_reward', (reward: any) => {
      console.log('🎉 User earned reward:', reward);
    });

    // Listen for ad closed
    this.rewardedAd.addAdEventListener('closed', () => {
      console.log('Ad closed, marking as not loaded and reloading...');
      this.isLoaded = false;
      // Small delay before reloading to ensure cleanup
      setTimeout(() => {
        console.log('🔄 Reloading ad after close...');
        this.load();
      }, 500);
    });

    // Start loading the ad
    this.load();
  }

  async load() {
    if (!this.isInitialized || !this.rewardedAd) {
      console.log('Cannot load ad: not initialized or ad not created');
      return;
    }

    // Don't load if already loading or loaded
    if (this.isLoading || this.isLoaded) {
      console.log('Ad already loading or loaded, skipping...');
      return;
    }

    try {
      console.log('🔄 Starting to load rewarded ad...');
      console.log('🔄 Ad unit ID:', REWARDED_AD_UNIT_ID);
      this.isLoading = true;
      this.isLoaded = false;
      await this.rewardedAd.load();
      console.log('✅ Ad load() call completed, waiting for loaded event...');
      // Note: The loaded event will set isLoaded = true when ad is actually ready
    } catch (error) {
      console.error('❌ Error loading ad:', error);
      if (error instanceof Error) {
        console.error('Load error message:', error.message);
        console.error('Load error stack:', error.stack);
      }
      this.isLoading = false;
      this.isLoaded = false;
    }
  }

  async show(): Promise<boolean> {
    if (!this.isInitialized || !this.rewardedAd) {
      console.log('AdService not initialized or ad not created');
      return false;
    }

    try {
      // If ad is not loaded, load it and wait for it to be ready
      if (!this.isLoaded) {
        console.log('Ad not loaded, loading now...');
        await this.load();
        
        // Wait for ad to load (poll every 500ms, max 10 seconds)
        let attempts = 0;
        const maxAttempts = 20; // 20 * 500ms = 10 seconds
        while (!this.isLoaded && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
          console.log(`Waiting for ad to load... attempt ${attempts}/${maxAttempts}`);
        }
      }

      if (this.isLoaded && this.rewardedAd) {
        console.log('✅ Showing rewarded ad...');
        await this.rewardedAd.show();
        // Mark as not loaded immediately (ad will be consumed)
        this.isLoaded = false;
        // Note: The 'closed' event listener will trigger reload
        return true;
      } else {
        console.log('❌ Ad failed to load after waiting, current state:', {
          isLoaded: this.isLoaded,
          isLoading: this.isLoading,
          hasRewardedAd: !!this.rewardedAd
        });
        // Try to load again for next time
        this.load();
        return false;
      }
    } catch (error) {
      console.error('Error showing ad:', error);
      this.isLoaded = false;
      // Try to load again for next time
      this.load();
      return false;
    }
  }

  getLoadedStatus(): boolean {
    return this.isLoaded;
  }

  // Force reload ad (useful when ad seems stuck)
  async forceReload(): Promise<void> {
    if (!this.isInitialized || !this.rewardedAd) {
      console.log('Cannot force reload: not initialized');
      return;
    }

    console.log('🔄 Force reloading ad...');
    this.isLoaded = false;
    this.isLoading = false;
    await this.load();
  }
}

let _adServiceInstance: AdService | null = null;

function getAdService(): AdService {
  if (!_adServiceInstance) {
    try {
      _adServiceInstance = new AdService();
    } catch (error) {
      console.error('Failed to create AdService:', error);
      _adServiceInstance = {
        getLoadedStatus: () => false,
        show: async () => false,
        load: async () => {},
      } as any;
    }
  }
  return _adServiceInstance;
}

export const adService = getAdService();

