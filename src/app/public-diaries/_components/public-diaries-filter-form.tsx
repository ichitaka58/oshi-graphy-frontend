import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ArtistCombobox from "./artist-combobox";
import { Button } from "@/components/ui/button";

type Props = {
  years: number[];
  months: number[];
  year?: string;
  month?: string;
  artistId?: number | null;
  artistName?: string | null;
};

const PublicDiariesFilterForm = ({ years, months, year, month, artistId, artistName }: Props) => {
  return (
    <form className="mb-4 flex flex-col sm:flex-row sm:items-center justify-center gap-2">
      <div className="flex gap-2">
        <Label htmlFor="year" className="text-base">
          年
        </Label>
        <Select name="year" defaultValue={year}>
          <SelectTrigger id="year" className="w-20">
            <SelectValue placeholder="年" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">全て</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={`${String(y)}`}>
                  {y}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Label htmlFor="month" className="text-base">
          月
        </Label>
        <Select name="month" defaultValue={month}>
          <SelectTrigger id="month" className="w-[70px]">
            <SelectValue placeholder="月" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">全て</SelectItem>
              {months.map((m) => (
                <SelectItem key={m} value={`${String(m)}`}>
                  {m}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ArtistCombobox
        defaultArtistId={artistId}
        defaultArtistName={artistName}
      />
      <Button type="submit">検索</Button>
    </form>
  );
}

export default PublicDiariesFilterForm;