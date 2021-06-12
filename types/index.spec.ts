export type TDemoSharedType = string;

import * as types from "./build/types";
import * as resolverTypes from "./build/resolvers-types";

export default { ...types, ...resolverTypes };
