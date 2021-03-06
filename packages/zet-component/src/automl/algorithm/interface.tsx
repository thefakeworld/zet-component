export interface ParamsItemSchema {
  /** 参数key */
  key: string;
  /** 名称 */
  name: string;
  /** 组件渲染类型，支持tag-input, select, input-number, input, radio-group, time-select */
  type: string;
  /** 是否支持多选，只有type=select支持此参数 */
  multiple?: boolean;
  /** 默认值 */
  default: any;
  /** 最大值 */
  max: number;
  /** 最小值 */
  min: number;
  /** 扩展描述 */
  extra: string;
  /** item数据，例如：select 的 option || radio group */
  data?: any;
  /** 配置子父级依赖关系 */
  condition?: string;
}

/** 当个数据项结构 */
export interface DataItemSchema {
  /** id */
  id: string;
  /** 名称 */
  name: string;
  /** 描述 */
  desc?: string;
  /** 是否可用 */
  checked?: boolean;
  /** 算法参数列表 */
  params: ParamsItemSchema[];
}

/** 单个value结构 */
export interface ValueItemSchema {
  /** 算法Id */
  id: string;
  /** 算法名称 */
  name: string;
  checked?: boolean;
  /** 参数选项 */
  params: object;
}
