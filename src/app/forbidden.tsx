const Forbidden = () => {
  return (
    <div className="flex flex-col gap-4 items-center max-w-lg m-auto px-12">
      <h1 className="font-bold text-2xl">アクセス権限がありません。</h1>
      <p className="text-sm">
        このページは管理者のみ閲覧できます。
      </p>
    </div>
  );
};

export default Forbidden;
