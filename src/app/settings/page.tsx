import BackButton from "@/components/back-button";
import EmailEditForm from "./_components/email-edit-form";
import PasswordUpdateForm from "./_components/password-update-form";
import AccountDeleteForm from "./_components/account-delete-form";

const SettingsPage = () => {
  return (
    <>
      <div className="text-muted-foreground py-3 flex items-center text-sm">
        <BackButton />
      </div>
      <div className="w-75 mx-auto mt-4 flex flex-col gap-4">
        <h1 className="font-bold text-center">アカウント設定</h1>
        <EmailEditForm />
        <PasswordUpdateForm />
        <AccountDeleteForm />
      </div>
    </>
  );
}

export default SettingsPage;