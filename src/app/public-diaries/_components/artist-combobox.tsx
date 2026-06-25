"use client";

import { searchArtists } from "@/app/artists/actions";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Artist } from "@/types/artist";
import { useEffect, useState } from "react";

type Props = {
  defaultArtistId?: number | null;
  defaultArtistName?: string | null; 
}

const ArtistCombobox = ({defaultArtistId, defaultArtistName}: Props) => {
  const [query, setQuery] = useState<string>("");
  const [artists, setArtists] = useState<Artist[]>([]);
  // 選択後に artists（検索結果）が変わっても名前を表示し続けるため別 state で保持する
  const [selectedArtistName, setSelectedArtistName] = useState<string>(defaultArtistName ?? "");
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(defaultArtistId ?? null)

  // 入力のたびに API を叩かないよう 300ms デバウンスする
  useEffect(() => {
    if (query.length < 1) return;
    const timer = setTimeout(async () => {
      const results = await searchArtists(query);
      setArtists(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="sm:flex gap-2">
      <Label htmlFor="artist" className="text-base">
        アーティスト
      </Label>
      <Combobox
        filteredItems={artists}
        name="artist_id"
        value={selectedArtistId}
        onInputValueChange={(value, details) => {
          if (details.reason === "input-change") {
            setQuery(value);
          }
        }}
        onValueChange={(value) => {
          setSelectedArtistId(value);
          if(value) {
            const artist = artists.find((a) => a.id === value);
            setSelectedArtistName(artist?.name ?? "");
          }else {
            setSelectedArtistName("");
          }
        }}
        itemToStringLabel={() => selectedArtistName}
      >
        <ComboboxInput placeholder="アーティストを検索" id="artist" showClear />
        <ComboboxContent>
          <ComboboxEmpty>アーティストが存在しません</ComboboxEmpty>
          <ComboboxList>
            {(item: Artist) => (
              <ComboboxItem key={item.id} value={item.id}>
                {item.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default ArtistCombobox;
