import * as React from 'react';
import { Card,Tooltip,Icon,Menu,Anchor,Button,Modal} from 'antd';
import Group from './taskGroup';
import classNames from 'classnames'
import ContrastButton from './contrastButton'
import ZetIcon from '../../components/icon'
import styles from './index.less';

const MenuItem = Menu.Item;
const { Link } = Anchor;

interface JobInfo{
  jobStatus:string,
  jobId:string,
  jobName:string,
  modelList:ModelItem[]
}
interface ModelItem{
  modelName:string,
  modelId: string,
  jobBlockStatus:number,
  score:number,
  modelTrainStatus:string,
}
export interface TaskProps {
  /** 组件行行内样式 */
  style?: React.CSSProperties,
  /** 自定义类名 */
  className?: string,
  /** 宽度 */
  width?: string | number,
  /** 高度 */
  height?: string | number,
  /** title 样式扩展 */
  headStyle?: React.CSSProperties,
  /** 标题 */
  title?: string,
  /** 任务信息 */
  jobInfo: JobInfo,
  /** 模型对比id*/
  contrastIds:string[],
  /** 任务内对比*/
  innerContras?:boolean,
  /** 锚点内容展示的容器id */
  anchorContainerId?:string,
  /** model数据*/
  modelList?: ModelItem[],
  /** 默认 选中的任务id */
  selectedTaskId: string,
  /** 选中方法回调 */
  selectedRow?: (job: object) => void,
  setSelectedModelKeys?:(modelKeys: string[]) => void,
  selectedModelKeys?: string[],
  /** 删除任务回调 */
  delJob?: (id: string) => void,
  /** 点击标题 展示详情回调*/
  clickTitle?:(jobId:string,workflowVersionId:string)=>void,

  openModelDetail?:(modelId:string,jobId:string,modelName:string)=>void,
  showContras?:(record:object,jobName:string)=>void,
}


export interface TaskState {
  contrastJobId:string
}

class Task extends React.Component<TaskProps, TaskState> {
  static Group: typeof Group;
  constructor(props: TaskProps) {
    super(props);
    this.state = {
      contrastJobId:''
    }
  }
  changeJob = (v)=>{
    this.props.selectedRow(v)
  }
  delJob = (v)=>{
    const propsDelJob = this.props.delJob;
    Modal.confirm({
      title: '确定要删除吗？',
      okText: 'OK',
      cancelText: 'Cancel',
      onOk: () => {
        propsDelJob(v)
      },
    });
  }
  title=(v) => {
    this.props.clickTitle(v.jobId,v.workflowVersionId)
  }
  changeJobItem = (item) => {
    this.props.setSelectedModelKeys([item.modelId])
  }
  openModelDetail = (e,modelId,jobId,modelName)=>{
    e.stopPropagation();
    this.props.openModelDetail(modelId,jobId,modelName);
  }
  showContras = (item,jobId,jobName) => {
    const {innerContras} = this.props
    innerContras && this.setState({
      contrastJobId:jobId
    })
    this.props.showContras(item,jobName)
  };

  render() {
    let {title,jobInfo,modelList,selectedTaskId,contrastIds,selectedModelKeys,anchorContainerId} = this.props;
    title = title || jobInfo.jobName || '';
    modelList = modelList || jobInfo.modelList;
    contrastIds = contrastIds || [];
    const { contrastJobId } = this.state;
    const taskClass = classNames(styles.zetTask,{[styles.selectedTitle]:selectedTaskId===jobInfo.jobId});
    const getContainer = anchorContainerId ? {getContainer:() => document.getElementById(anchorContainerId)} :{}
    return (
      <Card
        title={(
          <div className={styles.cardTitle} onClick={() => { this.changeJob(jobInfo); }}>
            <span className={styles.taskListTitle}>
              <span className={styles.taskListName} title={title}>
                <a onClick={() => { this.title(jobInfo); }} >{title}</a>
              </span>
              <span className={styles.cardTitleOptions}>
                {jobInfo.jobStatus === 'RUNNING' && <Icon type="loading" theme="outlined" />}
                <Tooltip title={'删除'}>
                  <Icon style={{ marginLeft: 35 }} type="delete" theme="outlined"
                        onClick={(e) => { e.stopPropagation(); this.delJob(jobInfo.jobId); }} />
                </Tooltip>
              </span>
            </span>
          </div>
        )}
        style={{ width: 324 }}
        key={jobInfo.jobId}
        className={taskClass}
      >
        <Anchor
          affix={false}
          bounds={0}
          className={styles.taskAnchor}
          {...getContainer}
        >
          <Menu
            style={{ border: 'none' }}
            selectedKeys={selectedModelKeys}
          >
            {
              modelList && modelList.map((item, i) => {
                return (
                  <MenuItem key={item.modelId} style={{ padding: '0 14px' }} onClick={() => { this.changeJob(jobInfo); this.changeJobItem(item); }}>
                    <Link
                      href={`#${item.modelId}`}
                      title={(
                        <div className={`${styles.linkWrap} ${(jobInfo.jobStatus === 'FAIL' && (item.modelTrainStatus !== 'SUCCESS')) ? styles.linkWraperr : ''}`}>
                          <div
                            title={item.modelName}
                            onClick={(e) => {this.openModelDetail(e, item.modelId, jobInfo.jobId, item.modelName);}}
                            className={styles.shortName}
                          >
                            {item.modelName}
                          </div>
                          <div style={{ width: '110px' }}>
                              <span style={{ display: 'inline-block', width: '25px' }}>
                                { item.jobBlockStatus === 5 && <Icon type="loading" theme="outlined" /> }
                                { i === 0 && item.score && <ZetIcon type='zeticon-trophy' style={{ fontSize: 16, color: 'rgb(25, 118, 210)' }} />}
                              </span>
                            <span>{item.score ? item.score : '--'}</span>
                          </div>
                          <div style={{ width: '80px', textAlign: 'right' }}>
                            <ContrastButton
                              style={{ marginLeft: '0px' }}
                              contrastIds={contrastIds}
                              item={item}
                              jobName={jobInfo.jobName}
                              jobId={jobInfo.jobId}
                              contrastJobId={contrastJobId}
                              showContras={this.showContras} />
                          </div>
                        </div>
                      )}
                    />
                  </MenuItem>
                );
              })
            }
          </Menu>
        </Anchor>
      </Card>
    );
  }
}

export default Task