import { produce } from "immer"

export const patchHandleDrop = (plannerItem,data) =>
{
    const updatedState = produce(plannerItem, (draft) => {
        const currentDragItem = plannerItem.findIndex(x=>x.plannerlocationitemsid === data.A_PlannerLocID)
        const currentdropItem = plannerItem.findIndex(x=>x.plannerlocationitemsid === data.B_PlannerLocID)
        draft[currentDragItem].plannerlocationitemsid = data.B_PlannerLocID;
        draft[currentdropItem].plannerlocationitemsid = data.A_PlannerLocID;       
      });
    return updatedState;
}