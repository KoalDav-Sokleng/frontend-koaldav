import habitGardenService from "../../../api/habitGardenService";

export const getHabits = () => habitGardenService.listHabits();
export const createHabit = (payload) => habitGardenService.createHabit(payload);
export const toggleHabitDone = (id, date) => habitGardenService.toggleHabit(id, { date });
export const deleteHabit = (id) => habitGardenService.deleteHabit(id);
export const getGarden = () => habitGardenService.getGarden();
export const useFreeze = (date) => habitGardenService.useFreeze({ date });
