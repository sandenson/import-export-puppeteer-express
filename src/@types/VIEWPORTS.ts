interface IViewPortsResolution {
  "1920x1080": IVp,
  "1440x900": IVp,
  "1280x720": IVp,
  "1024x620": IVp,
  "640x480": IVp,
}

export interface IVp{
  /**
   * page width in pixels.
   */
  width?: number | undefined;
  /**
   * page height in pixels.
   */
  height?: number | undefined;
  /**
   * Specify device scale factor (can be thought of as dpr).
   * @default 1
   */
  deviceScaleFactor?: number | undefined;
  /**
   * Whether the meta viewport tag is taken into account.
   * @default false
   */
  isMobile?: boolean | undefined;
  /**
   * Specifies if viewport supports touch events.
   * @default false
   */
  hasTouch?: boolean | undefined;
  /**
   * Specifies if viewport is in landscape mode.
   * @default false
   */
  isLandscape?: boolean | undefined;
}

const VIEWPORTS: IViewPortsResolution = {
  "1920x1080": {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      isLandscape: true,
  },
  "1440x900": {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      isLandscape: true,
  },
  "1280x720": {
      width: 1280,
      height: 720,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      isLandscape: true,
  },
  "1024x620": {
      width: 1024,
      height: 620,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      isLandscape: true,
  },
  "640x480": {
      width: 640,
      height: 480,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      isLandscape: true,
  }
};

export type VIEWPORTSENUM = keyof IViewPortsResolution;

export default VIEWPORTS;