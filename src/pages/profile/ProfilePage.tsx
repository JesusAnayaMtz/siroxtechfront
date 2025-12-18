import ProfileForm from "@/components/profile/ProfileForm"

export default function ProfilePage() {
    return (
        <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] space-y-8 p-4">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
                <p className="text-muted-foreground mt-2">
                    Administra tu información personal y seguridad.
                </p>
            </div>

            <div className="w-full max-w-2xl bg-card rounded-xl shadow-lg border border-border">
                <ProfileForm />
            </div>
        </div>
    )
}
