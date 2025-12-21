import {useState, useEffect, useCallback} from 'react';
import {rewardedAdService} from '../services/RewardedAdService';

export const useRewardedAd = () => {
  const [isAdReady, setIsAdReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check ad status periodically
    const interval = setInterval(() => {
      try {
        if (rewardedAdService && typeof rewardedAdService.getLoadedStatus === 'function') {
          setIsAdReady(rewardedAdService.getLoadedStatus());
        }
      } catch (err) {
        console.error('Error checking ad status:', err);
      }
    }, 1000);

    // Initial check with delay to allow SDK initialization
    const initialCheck = setTimeout(() => {
      try {
        if (rewardedAdService && typeof rewardedAdService.getLoadedStatus === 'function') {
          setIsAdReady(rewardedAdService.getLoadedStatus());
        }
      } catch (err) {
        console.error('Error getting initial ad status:', err);
      }
    }, 2000); // Wait 2 seconds for SDK to initialize

    return () => {
      clearInterval(interval);
      clearTimeout(initialCheck);
    };
  }, []);

  const showRewardedAd = useCallback(async (): Promise<boolean> => {
    if (!rewardedAdService || typeof rewardedAdService.show !== 'function') {
      setError('Ad service not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      const success = await rewardedAdService.show();
      setIsLoading(false);
      return success;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to show ad';
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, []);

  return {
    isAdReady,
    isLoading,
    error,
    showRewardedAd,
  };
};
