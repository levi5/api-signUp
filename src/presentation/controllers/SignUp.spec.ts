import {SignUpController} from './SignUp';


describe('SignUp Controller', () => {

    test('return error 400 if the name is not provided', () => {
      const sut = new SignUpController();
      const httpRequest = {
          body:{
              email:'any@email.com',
              password:'any_password',
              passwordConfirmation:'any_password'
          }

      }
     const httpResponse =  sut.handle(httpRequest)
     expect(httpResponse.statusCode).toBe(400);
     expect(httpResponse.body).toEqual(new Error('Missing param: name'));


        
    });



    test('return error 400 if the email is not provided', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body:{
                name:'any_name',
                password:'any_password',
                passwordConfirmation:'any_password'
            }
  
        }
       const httpResponse =  sut.handle(httpRequest)
       expect(httpResponse.statusCode).toBe(400);
       expect(httpResponse.body).toEqual(new Error('Missing param: email'));
  
  
          
      });
    
    
});
