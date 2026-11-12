

export const PROFILE_DATA = {
    es: {
        title: "Configuracion",
        subtitle: "Gestiona el teu perfil i la configuració del compte",
        sidebar: [
            {
                title: 'Perfil',
                url: '/settings/profile',

            },
            {
                title: 'Contraseña',
                url: '/settings/password',

            },
            {
                title: 'Historial',
                url: '/settings/history'
            }
        ],
        profile: {
            title: "Informacion de Perfil",
            subtitle: "Actualiza tu correo electronico aquí",
            labels: {
                name: "Nombre",
                email: "Correo eletronico"
            },
            actions: {
                save: "Guardar Cambios",
                delete: "Eliminar Perfil"
            },
            delete: {
                title: "Borrar Perfil",
                subtitle: "Elimina tu cuenta y todos sus recursos",
                modal: {
                    title: "¿Seguro que quieres eliminar este perfil?",
                    message: "Una vez borrado, todas tus interacciones seran borradas"
                }
            }
        },
        password: {
            title: "Actualizar Contraseña",
            subtitle: "Asegúrate de que tu cuenta utilice una contraseña larga y aleatoria para mantener la seguridad.",
            labels: {
                current: "Contraseña Actual",
                new: "Nueva Contraseña",
                confirm: "Confirmar Contraseña"
            },
            actions: {
                save: "Guardar Cambios",
            },
        },
    },
    en: {
        title: "Settings",
        subtitle: "Manage your profile and account settings",
        sidebar: [
            {
                title: 'Profile',
                url: '/settings/profile',

            },
            {
                title: 'Password',
                url: '/settings/password',

            },
            {
                title: 'History',
                url: '/settings/history'
            }
        ],
        profile: {
            title: "Profile Information",
            subtitle: "Update your email here",
            labels: {
                name: "Name",
                email: "Email"
            },
            actions: {
                save: "Save Changes",
                delete: "Delete Profile"
            },
            delete: {
                title: "Delete Account",
                subtitle: "Delete your account and all of its resources",
                modal: {
                    title: "Are you sure you want to delete this profile?",
                    message: "Once deleted, all your interactions will be erased."
                }
            }
        },
        password: {
            title: "Update Password",
            subtitle: "Ensure your account is using a long, random password to stay secure.",
            labels: {
                current: "Current Password",
                new: "New Password",
                confirm: "Confirm Password"
            },
            actions: {
                save: "Save Changes",
            },
        },
    }
}

export type PROFILE_DATA_TYPE = typeof PROFILE_DATA.es