import {statusList,levelList} from '@/config/params'

export const getLevelCn = (level) => {
  let label = '未知';
  for(let i in levelList) {
    if (levelList[i].value === level) {
      label =levelList[i].label;
      break;
    }
  }
  return label
}
