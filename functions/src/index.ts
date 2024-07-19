import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as functions from 'firebase-functions';
import { differenceInYears } from 'date-fns';

admin.initializeApp();

const saltRounds = 10;
const defaultPasswordLength = 12;

export const onCreateUser = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();

    if (!userData?.password) {
      const defaultPassword = crypto
        .randomBytes(defaultPasswordLength / 2)
        .toString('hex');

      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

      await snap.ref.update({ password: hashedPassword });

      console.log(
        `Contraseña por defecto generada dasdasdasdy actualizada para el usuario ${context.params.userId}`,
      );
    }
  });

export const onCreateCustomer = functions.firestore
  .document('customers/{customerId}')
  .onCreate(async (snap, context) => {
    console.log('Cliente creado:', snap.id);
    const customerData = snap.data();

    if (customerData && customerData.birthday) {
      const birthday = new Date(customerData.birthday);
      const age = calculateAge(birthday);

      await snap.ref.update({ age });

      console.log(
        `Edad calculada y actualizada para el cliente ${context.params.customerId}`,
      );
    }
  });

export const onUpdateCustomer = functions.firestore
  .document('customers/{customerId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    if (beforeData?.birthday !== afterData?.birthday) {
      console.log(
        'Actualización de cumpleaños para el cliente:',
        context.params.customerId,
      );

      if (afterData?.birthday) {
        const birthday = new Date(afterData.birthday);
        const age = calculateAge(birthday);

        await change.after.ref.update({ age });

        console.log(
          `Edad actualizada para el cliente ${context.params.customerId}`,
        );
      }
    }
  });

function calculateAge(birthday: Date): number {
  return differenceInYears(new Date(), birthday);
}

const firestore = admin.firestore();
firestore.settings({
  host: 'localhost:8080',
  ssl: false,
});
