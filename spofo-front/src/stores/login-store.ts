import { defineStore } from 'pinia';
import { Member } from '../components/models/member';

type State = {
  isAuthed: boolean;
  member: Member;
};

export const loginStore = defineStore('login', {
  state: (): State => ({
    isAuthed: false,
    member: new Member('', '')
  }),

  // 주의 : getter는 변수명과 동일하게 사용하면 안된다.
  getters: {
    // isAuthed: (state) => state.isAuthed, -> not working
    // member: (state) => state.member, -> not working
    isAuthedMember: (state) => state.isAuthed,
    getMember: (state) => state.member
  },
  actions: {
    login(member: Member): void {
      this.isAuthed = true;
      this.member = member;
    },
    logout(): void {
      this.isAuthed = false;
      this.member = new Member('', '');
      localStorage.removeItem('authorization');
      localStorage.removeItem('socialType');
    },
    isStoredMember(): boolean {
      return this.isAuthed;
    }
  },
  persist: {
    storage: localStorage
  }
});
