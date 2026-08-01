import { getCurrentUser } from "@/lib/auth";
import { forbidden } from "next/navigation";
import ArtistForm from "../_components/artist-form";
import BackButton from "@/components/back-button";

const ArtistCreatePage = async () => {
    const loginUser = await getCurrentUser();
    if(!loginUser.is_admin) {
      forbidden();
    }
  return (
    <div>
      <div className="text-muted-foreground py-3 flex items-center text-sm">
        <BackButton />
      </div>
      <div className="w-75 mx-auto mt-4">
        <ArtistForm mode="create" />
      </div>
    </div>
  );
}

export default ArtistCreatePage;