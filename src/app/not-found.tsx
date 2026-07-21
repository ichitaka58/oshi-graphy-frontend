const NotFound = () => {
  return (
    <div className="flex flex-col gap-4 items-center max-w-lg m-auto px-12">
      <h1 className="font-bold text-2xl">お探しのページが見つかりません。</h1>
      <p className="text-sm">URLが正しくないか、日記・コメントが削除された可能性があります。</p>
    </div>
  )
}

export default NotFound;