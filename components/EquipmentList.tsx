'use client'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

const styles = {
  combobox: {
    height: "64px",
    backgroundColor: "#000000",
  }
}

type EquipmentProps = {
    label: string[],
    image: string[],
    statuses: string[],
    onStatusChange: (index: number, value: string) => void
}

type AvailabilityStatusProps = {
  value: string;
  onChange: (value: string) => void;
  /** Combobox choices; defaults to the equipment Present/Not Present pair. */
  items?: string[];
}

const DEFAULT_ITEMS = ["Present", "Not Present"]

export function AvailabilityStatus({ value, onChange, items = DEFAULT_ITEMS }: AvailabilityStatusProps) {
  // The Combobox fires onValueChange during its own normalization passes (e.g.
  // null while the controlled value is ""), so only propagate real changes —
  // unconditionally setting state here re-renders and loops infinitely.
  const handleValueChange = (val: string | null) => {
    const newVal = val ?? "";
    if (newVal !== value) onChange(newVal);
  };

  return (
    <Combobox items={items} value={value} onValueChange={handleValueChange}>
      <ComboboxInput placeholder="Not Selected" style={styles.combobox}/>
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export function EquipmentList({label, image, statuses, onStatusChange}: EquipmentProps){
    return(
        <div className="flex flex-column align-center gap-x-[100px] gap-y-[65px] justify-start items-stretch flex-wrap">
            {label.map((label, index) => (
            <div key={index} className="w-[30vh] flex flex-col">
                <div className="flex items-center justify-center h-[19vh] border-black border-[1px] rounded-[16px] mb-[10px]">
                  <img className="object-contain" style={{maxHeight: "90%"}} src={image[index]} alt={label} />
                </div>
                <p className="text-[24px] mb-[10px] mt-[5px] text-center">{label}</p>
                <div className="mt-auto">
                  {/* statuses lags label by one render while the fetched form settles; ?? "" keeps the Combobox controlled throughout */}
                  <AvailabilityStatus value={statuses[index] ?? ""} onChange={(val) => onStatusChange(index, val)} />
                </div>
            </div>
        ))}
        </div>
    )
}
