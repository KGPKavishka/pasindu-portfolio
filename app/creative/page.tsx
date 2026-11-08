import CreativeStudio from "@/components/CreativeStudio";

export default function CreativePage() {
    return (
        <main className="min-h-screen bg-void text-suit">
            <CreativeStudio
                showViewAll={false}
                title="Creative Archive"
                headingWords={[
                    "UI Design",
                    "Branding",
                    "Research",
                    "Traditional Art",
                    "Digital Art",
                ]}
                description="A curated collection of my UI designs, branding concepts, research posters and traditional artwork created throughout my academic and professional journey."
            />
        </main>
    );
}