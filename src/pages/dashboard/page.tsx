export default function Page() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-neutral-800 aspect-video rounded-xl" />
                <div className="bg-neutral-800 aspect-video rounded-xl" />
                <div className="bg-neutral-800 aspect-video rounded-xl" />
            </div>
            <div className="bg-neutral-800 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
    )
}
