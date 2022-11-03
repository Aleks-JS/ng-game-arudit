export namespace game {
  export interface Unit extends Coordinates {
    color: string;
  }

  export interface Coordinates {
    corX: number;
    corY: number;
  }

  export interface Wall extends Unit {
    block: boolean;
  }
}

export namespace actions {
  import Coordinates = game.Coordinates;

  export interface Directions {
    left?: Coordinates;
    right?: Coordinates;
    top?: Coordinates;
    bottom?: Coordinates;
  }
}
