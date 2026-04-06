// const STEPS_CONFIG: FormStep[] = [
//     {
//         id: 'account',
//         title: 'Join Nutrish',
//         description: 'Create your account to start.',
//         submitLabel: 'Next: Personal Details',
//         schema: registerSchema, // השכמה שהגדרת קודם
//         fields: accountFields,
//         action: async (data) => {
//             const res = await fetchApi<{ user: UserDTO }>('/api/auth/register', 'POST', data);
//             return { userId: res.user.id, success: true };
//         }
//     },
//     {
//         id: 'profile',
//         title: 'Tell us about yourself',
//         description: 'This helps us calculate your goals.',
//         submitLabel: 'Finish & Start',
//         schema: profileSchema,
//         fields: profileFields,
//         action: async (data, userId) => {
//             await fetchApi('/api/user/profile', 'POST', { ...data, userId });
//             return { success: true };
//         }
//     }
// ];
