import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.js";
import type { Instrument as InstrumentType } from "@/src/types.js";
import { Badge } from "@/components/ui/badge.js";
import { Separator } from "@/components/ui/separator.js";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer.js";
import { ScrollArea, ScrollAreaScrollbar } from "@radix-ui/react-scroll-area";

interface InstrumentProps {
  instrument: InstrumentType;
}

export const Instrument = ({ instrument }: InstrumentProps) => {
  const hasSold = instrument.variants.some(
    (variant) => variant.node.availableForSale === false
  );

  const asCurrency = (num: string) => {
    return Number(num).toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
    });
  };

  const title = instrument.title.slice(0, instrument.title.lastIndexOf("-"));
  const serialNumber = instrument.title.slice(
    instrument.title.lastIndexOf("-") + 1
  );

  return (
    <Drawer>
      <Card>
        <CardHeader>
          <span>
            {title} {hasSold && <Badge variant="destructive">Sold</Badge>}
          </span>
        </CardHeader>
        <CardContent>
          <CardDescription>
            <div className="mx-8">
              <Carousel>
                <CarouselContent>
                  {instrument.images.map((image) => (
                    <CarouselItem className="2xl:basis-1/2 flex justify-center">
                      <img
                        className="object-contain h-[400px]"
                        src={image.node.url}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            {asCurrency(instrument.variants[0].node.price.amount)}
          </CardDescription>
        </CardContent>
        <CardFooter>
          <DrawerTrigger>
            <Button variant="ghost">View Specs</Button>
          </DrawerTrigger>
          <Separator orientation="vertical" />
          <Button variant="link" disabled={hasSold}>
            Buy
          </Button>
        </CardFooter>
      </Card>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{serialNumber}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-72 rounded-md border">
          <div>
            {Object.entries(instrument.specs).map(([key, { value }]) => (
              <>
                <div>
                  {key}: {value}
                </div>
                <Separator className="my-2" />
              </>
            ))}
          </div>
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
