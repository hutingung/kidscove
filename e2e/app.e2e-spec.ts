import { MembershipPage } from './app.po';

describe('membership App', () => {
  let page: MembershipPage;

  beforeEach(() => {
    page = new MembershipPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
