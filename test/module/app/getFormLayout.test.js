
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../../test/utils/common');


const {Connection, Auth, App, KintoneAPIException} = require(common.MAIN_PATH);

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

const recordModule = new App(conn);

describe('getFormLayout function', () => {
  describe('common function', () => {
    const app = 1;
    it('should return promise', () => {
      nock('https://' + common.DOMAIN)
        .get(`/k/v1/app/form/layout.json?app=${app}`)
        .reply(200, {});

      const getAppResult = recordModule.getFormLayout(app);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('[Form-16] should return the app formfield base on full data', () => {
        const app = 10;
        const isPreview = false;
        const expectResult = {
          'revision': '2',
          'layout': [
            {
              'type': 'ROW',
              'fields': [
                {
                  'type': 'SINGLE_LINE_TEXT',
                  'code': 'Text__single_line_',
                  'size': {
                    'width': '200'
                  }
                }
              ]
            }
          ]
        };
        nock('https://' + common.DOMAIN)
          .get(`/k/v1/app/form/layout.json?app=${app}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(200, expectResult);

        const getFormLayoutResult = recordModule.getFormLayout(app, isPreview);
        return getFormLayoutResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify the list of fields and field settings of an live App with pre-live settings are returned', () => {
      it('[Form-17] should return the app formfield base on full data', () => {
        const app = 10;
        const expectResult = {
          'layout': [
            {
              'type': 'ROW',
              'fields': [
                {
                  'type': 'SINGLE_LINE_TEXT',
                  'code': 'Text',
                  'size': {
                    'width': '193'
                  }
                }
              ]
            }
          ],
          'revision': '16'
        };
        nock('https://' + common.DOMAIN)
          .get(`/k/v1/app/form/layout.json?app=${app}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(200, expectResult);

        const getFormLayoutResult = recordModule.getFormLayout(app);
        return getFormLayoutResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify the app form field with a pre-live settings is returned when setting isPreview true', () => {
      it('[Form-19] should return the app formfield base on full data', () => {
        const app = 10;
        const isPreview = true;
        const expectResult = {
          'layout': [
            {
              'type': 'ROW',
              'fields': [
                {
                  'type': 'SINGLE_LINE_TEXT',
                  'code': 'Text',
                  'size': {
                    'width': '193'
                  }
                },
                {
                  'type': 'NUMBER',
                  'code': 'Number',
                  'size': {
                    'width': '193'
                  }
                }
              ]
            }
          ],
          'revision': '20'
        };
        nock('https://' + common.DOMAIN)
          .get(`/k/v1/preview/app/form/layout.json?app=${app}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(200, expectResult);

        const getFormLayoutResult = recordModule.getFormLayout(app, isPreview);
        return getFormLayoutResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify the app form field with a pre-live settings is not returned when setting isPreview false', () => {
      it('[Form-20] should return the app formfield base on full data', () => {
        const app = 10;
        const isPreview = false;
        const expectResult = {
          'revision': '2',
          'layout': [
            {
              'type': 'ROW',
              'fields': [
                {
                  'type': 'SINGLE_LINE_TEXT',
                  'code': 'Text__single_line_',
                  'size': {
                    'width': '200'
                  }
                }
              ]
            }
          ]
        };
        nock('https://' + common.DOMAIN)
          .get(`/k/v1/app/form/layout.json?app=${app}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(200, expectResult);

        const getFormLayoutResult = recordModule.getFormLayout(app, isPreview);
        return getFormLayoutResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify the app of Guest Space is returned', () => {
      it('[Form-24] should return the app formfield base on full data', () => {
        const app = 1;
        const isPreview = false;
        const expectResult = {
          'revision': '2',
          'layout': [
            {
              'type': 'ROW',
              'fields': [
                {
                  'type': 'SINGLE_LINE_TEXT',
                  'code': 'Text__single_line_',
                  'size': {
                    'width': '200'
                  }
                }
              ]
            }
          ]
        };
        nock('https://' + common.DOMAIN)
          .get(`/k/guest/1/v1/app/form/layout.json?app=${app}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(200, expectResult);

        const conn1 = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
        const formLayout = new App(conn1);
        const getFormLayoutResult = formLayout.getFormLayout(app, isPreview);
        return getFormLayoutResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
  });

  describe('error case', () => {
    describe('The error will be displayed when using invalid app ID', () => {
      it('[Form-21] should return error in the result', () => {
        const app = 'abc';
        const isPreview = false;
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'PbKNsufheaeqXulVAdGv',
          'message': 'Missing or invalid input.',
          'errors': {
            'app': {
              'messages': [
                'Enter an integer value.'
              ]
            }
          }
        };
        nock('https://' + common.DOMAIN)
          .get(`/k/v1/app/form/layout.json?app=${app}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(400, expectResult);

        const getFormLayoutResult = recordModule.getFormLayout(app, isPreview);
        return getFormLayoutResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using method without app ID', () => {
      it('[Form-22] should return error in the result', () => {
        const isPreview = false;
        const expectResult = {
          'code': 'CB_VA01',
          'id': '6GVXCJ0sCnMFn1sDJ6cw',
          'message': 'Missing or invalid input.',
          'errors': {
            'app': {
              'messages': [
                'Required field.'
              ]
            }
          }
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app/form/layout.json', (rqBody) => {
            expect(rqBody.isPreview).toBeFalsy();
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(400, expectResult);

        const getFormLayoutResult = recordModule.getFormLayout(undefined, isPreview);
        return getFormLayoutResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Error will be displayed when using this method with pre-live settings with user who does not have Permission to manage the App', () => {
      it('[Form-26] should return error in the result', () => {
        const app = 1;
        const isPreview = false;
        const expectResult = {
          'code': 'CB_NO02',
          'id': '7sqH5vh2McTqtFz0o0LB',
          'message': 'No privilege to proceed.'
        };
        nock('https://' + common.DOMAIN)
          .get(`/k/v1/app/form/layout.json?app=${app}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(400, expectResult);

        const getFormLayoutResult = recordModule.getFormLayout(app, isPreview);
        return getFormLayoutResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('using API token authentication', () => {
      it('[Form-15] should return error when using API token authentication ', () => {
        const expectResult = {
          'code': 'GAIA_NO01',
          'id': 'lzQPJ1hkW3Aj4iVebWCG',
          'message': 'Using this API token, you cannot run the specified API.'
        };
        nock('https://' + common.DOMAIN)
          .get(`/k/v1/app/form/layout.json?app=10`)
          .reply(403, expectResult);
        const getFormLayoutResult = recordModule.getFormLayout(10);
        return getFormLayoutResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});
