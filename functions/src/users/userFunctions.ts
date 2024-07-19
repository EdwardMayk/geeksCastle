// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// import * as crypto from 'crypto';
// import * as bcrypt from 'bcrypt';

// admin.initializeApp();

// const saltRounds = 10;
// const defaultPasswordLength = 12;

// export const onCreateUser = functions.firestore
//   .document('users/{userId}')
//   .onCreate(async (snap, context) => {
//     const userData = snap.data();

//     if (!userData?.password) {
//       const defaultPassword = crypto
//         .randomBytes(defaultPasswordLength / 2)
//         .toString('hex');

//       const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

//       await snap.ref.update({ password: hashedPassword });

//       console.log(
//         `Contraseña por defecto generada dasdasdasdy actualizada para el usuario ${context.params.userId}`,
//       );
//     }
//   });
