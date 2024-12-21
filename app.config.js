const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;

module.exports = {
  expo: {
    name: "pataCorazon",
    slug: "pataCorazon",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.RECORD_AUDIO",
      ],
      package: "com.kevsc.pataCorazon",
      googleServicesFile: googleServicesJson ?? "./google-services.json",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-secure-store",
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "39720085-57ec-4dbc-a223-2c60d06b70b7",
      },
    },
    runtimeVersion: "1.0.0",
    updates: {
      url: "https://u.expo.dev/39720085-57ec-4dbc-a223-2c60d06b70b7",
    },
  },
};
