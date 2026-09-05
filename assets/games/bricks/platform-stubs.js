/**
 * Stubs for Yandex Games SDK and Playgama Bridge.
 * Lets the Godot WebGL build run outside the Yandex Games shell:
 * ads resolve instantly, progress stays in localStorage, auth stays guest.
 */
(function () {
  "use strict";

  function detectLang() {
    try {
      var saved = localStorage.getItem("portfolio-lang");
      if (saved === "ru" || saved === "en") return saved;
    } catch (e) {}
    try {
      var nav = String(navigator.language || "ru").toLowerCase();
      return nav.indexOf("ru") === 0 ? "ru" : "en";
    } catch (e) {
      return "ru";
    }
  }

  function detectDevice() {
    try {
      if (window.matchMedia("(pointer: coarse)").matches) return "mobile";
    } catch (e) {}
    return "desktop";
  }

  function later(fn, ms) {
    return setTimeout(fn, ms == null ? 40 : ms);
  }

  function storageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      if (value == null) localStorage.removeItem(key);
      else localStorage.setItem(key, String(value));
    } catch (e) {}
  }

  function createEmitter() {
    var listeners = {};
    return {
      on: function (event, cb) {
        if (!event || typeof cb !== "function") return;
        (listeners[event] || (listeners[event] = [])).push(cb);
      },
      emit: function (event, value) {
        var list = listeners[event] || [];
        for (var i = 0; i < list.length; i += 1) {
          try {
            list[i](value);
          } catch (e) {}
        }
      },
    };
  }

  var lang = detectLang();
  var device = detectDevice();
  var SAVE_KEY = "pm_save_v1";

  function guestPlayer() {
    return {
      isAuthorized: function () {
        return false;
      },
      getName: function () {
        return "";
      },
      getPhoto: function () {
        return "";
      },
      getUniqueID: function () {
        return "portfolio-guest";
      },
      getData: function () {
        var raw = storageGet(SAVE_KEY);
        var payload = {};
        if (raw) {
          try {
            payload = JSON.parse(raw);
          } catch (e) {
            payload = { raw: raw };
          }
        }
        return Promise.resolve({ pm_save_v1: payload });
      },
      setData: function (data) {
        try {
          if (data && data.pm_save_v1 != null) {
            storageSet(SAVE_KEY, JSON.stringify(data.pm_save_v1));
          }
        } catch (e) {}
        return Promise.resolve();
      },
    };
  }

  var ysdk = {
    environment: {
      i18n: { lang: lang, tld: "ru" },
    },
    deviceInfo: {
      type: device,
      isMobile: function () {
        return device === "mobile";
      },
      isDesktop: function () {
        return device === "desktop";
      },
      isTablet: function () {
        return false;
      },
      isTV: function () {
        return false;
      },
    },
    features: {
      LoadingAPI: {
        ready: function () {},
      },
      GameplayAPI: {
        start: function () {},
        stop: function () {},
      },
    },
    adv: {
      showFullscreenAdv: function (options) {
        var cb = (options && options.callbacks) || {};
        try {
          if (cb.onOpen) cb.onOpen();
        } catch (e) {}
        later(function () {
          try {
            if (cb.onClose) cb.onClose(false);
          } catch (e) {}
        });
      },
      showRewardedVideo: function (options) {
        var cb = (options && options.callbacks) || {};
        try {
          if (cb.onOpen) cb.onOpen();
        } catch (e) {}
        later(function () {
          try {
            if (cb.onRewarded) cb.onRewarded();
          } catch (e) {}
          try {
            if (cb.onClose) cb.onClose(true);
          } catch (e) {}
        }, 80);
      },
      showBannerAdv: function () {
        return Promise.resolve({ sticky: false, reason: "offline" });
      },
      hideBannerAdv: function () {
        return Promise.resolve();
      },
    },
    auth: {
      openAuthDialog: function () {
        return Promise.reject(new Error("offline"));
      },
    },
    leaderboards: {
      setScore: function () {
        return Promise.resolve();
      },
      getEntries: function () {
        return Promise.resolve({ entries: [], userRank: 0 });
      },
    },
    isAvailableMethod: function () {
      return Promise.resolve(false);
    },
    getPlayer: function () {
      return Promise.resolve(guestPlayer());
    },
    on: function () {},
  };

  window.YaGames = {
    init: function () {
      return Promise.resolve(ysdk);
    },
  };

  function rejectUnsupported() {
    return Promise.reject(new Error("unsupported"));
  }

  function resolveEmpty() {
    return Promise.resolve();
  }

  function resolveList() {
    return Promise.resolve([]);
  }

  var platformEvents = createEmitter();
  var adEvents = createEmitter();
  var PREFIX = "playgama-stub:";

  var advertisement = {
    minimumDelayBetweenInterstitial: 0,
    isBannerSupported: false,
    isInterstitialSupported: true,
    isRewardedSupported: true,
    isAdvancedBannersSupported: false,
    bannerState: "hidden",
    interstitialState: "closed",
    rewardedState: "closed",
    rewardedPlacement: "",
    advancedBannersState: "hidden",
    on: adEvents.on,
    setMinimumDelayBetweenInterstitial: function (value) {
      this.minimumDelayBetweenInterstitial = Number(value) || 0;
    },
    showBanner: function () {},
    hideBanner: function () {},
    showAdvancedBanners: function () {},
    hideAdvancedBanners: function () {},
    checkAdBlock: function () {
      return Promise.resolve(false);
    },
    showInterstitial: function () {
      var self = this;
      self.interstitialState = "loading";
      adEvents.emit("interstitial_state_changed", "loading");
      later(function () {
        self.interstitialState = "opened";
        adEvents.emit("interstitial_state_changed", "opened");
        later(function () {
          self.interstitialState = "closed";
          adEvents.emit("interstitial_state_changed", "closed");
        });
      });
    },
    showRewarded: function (placement) {
      var self = this;
      self.rewardedPlacement = placement || "";
      self.rewardedState = "loading";
      adEvents.emit("rewarded_state_changed", "loading");
      later(function () {
        self.rewardedState = "opened";
        adEvents.emit("rewarded_state_changed", "opened");
        later(function () {
          self.rewardedState = "rewarded";
          adEvents.emit("rewarded_state_changed", "rewarded");
          later(function () {
            self.rewardedState = "closed";
            adEvents.emit("rewarded_state_changed", "closed");
          });
        }, 50);
      });
    },
  };

  var storage = {
    get: function (key) {
      if (Array.isArray(key)) {
        return Promise.resolve(
          key.map(function (item) {
            return storageGet(PREFIX + item);
          })
        );
      }
      return Promise.resolve(storageGet(PREFIX + key));
    },
    set: function (key, value) {
      if (Array.isArray(key)) {
        for (var i = 0; i < key.length; i += 1) {
          storageSet(PREFIX + key[i], Array.isArray(value) ? value[i] : value);
        }
        return Promise.resolve();
      }
      storageSet(PREFIX + key, value);
      return Promise.resolve();
    },
    delete: function (key) {
      if (Array.isArray(key)) {
        key.forEach(function (item) {
          storageSet(PREFIX + item, null);
        });
        return Promise.resolve();
      }
      storageSet(PREFIX + key, null);
      return Promise.resolve();
    },
  };

  window.bridge = {
    engine: "godot-4",
    initialize: function () {
      return Promise.resolve();
    },
    game: {
      setLoadingProgress: function () {},
    },
    platform: {
      id: "mock",
      payload: null,
      language: lang,
      tld: "ru",
      isAudioEnabled: true,
      isExternalCallsSupported: false,
      isExternalLinksAllowed: true,
      on: platformEvents.on,
      sendMessage: function () {},
      sendCustomMessage: function () {},
      getServerTime: function () {
        return Promise.resolve(Date.now());
      },
    },
    device: {
      type: device,
    },
    player: {
      isAuthorizationSupported: false,
      isAuthorized: false,
      isGuest: true,
      id: "portfolio-guest",
      name: "",
      extra: {},
      photos: [],
      authorize: rejectUnsupported,
    },
    storage: storage,
    advertisement: advertisement,
    social: {
      isShareSupported: false,
      isJoinCommunitySupported: false,
      isInviteFriendsSupported: false,
      isCreatePostSupported: false,
      isAddToFavoritesSupported: false,
      isAddToHomeScreenSupported: false,
      isRateSupported: false,
      share: rejectUnsupported,
      joinCommunity: rejectUnsupported,
      inviteFriends: rejectUnsupported,
      createPost: rejectUnsupported,
      addToFavorites: rejectUnsupported,
      addToHomeScreen: rejectUnsupported,
      rate: rejectUnsupported,
    },
    leaderboards: {
      type: "in_game",
      setScore: resolveEmpty,
      getEntries: resolveList,
      showNativePopup: rejectUnsupported,
    },
    payments: {
      isSupported: false,
      purchase: rejectUnsupported,
      consumePurchase: rejectUnsupported,
      getCatalog: resolveList,
      getPurchases: resolveList,
    },
    achievements: {
      unlock: resolveEmpty,
      getAchievements: resolveList,
    },
    remoteConfig: {
      isSupported: false,
      setContext: function () {},
      get: function () {
        return Promise.resolve({});
      },
    },
    crossPromo: {
      isVisible: false,
      getGames: resolveList,
      show: function () {},
      hide: function () {},
    },
    tasks: {
      getTasks: resolveList,
      addProgress: resolveEmpty,
      claimReward: function () {
        return Promise.resolve(false);
      },
    },
    dailyRewards: {
      getRewards: resolveList,
      getCurrentDay: function () {
        return Promise.resolve(0);
      },
      getCurrentReward: function () {
        return Promise.resolve(null);
      },
      claimCurrentReward: function () {
        return Promise.resolve(false);
      },
    },
    notifications: {
      isSupported: false,
      schedule: rejectUnsupported,
      cancel: rejectUnsupported,
      cancelAll: rejectUnsupported,
    },
  };
})();
