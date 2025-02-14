"use client";
import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from "@/components";
import { fuels, yearsOfProduction } from "@/constants";
import { fetchCars, generateCarImageUrl } from "@/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);
  //search state
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  //filter state
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState(2022);
  //pagination state
  const [limit, setLimit] = useState(10);

  const getCars = async () => {
    setLoading(true);
    try {
      const result = await fetchCars({
        manufacturer: manufacturer,
        year: year,
        fuel: fuel,
        limit: limit,
        model: model,
      });
      setAllCars(result);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCars();
  }, [year, fuel, manufacturer, model, limit]);

  return (
    <main className="overflow-hidden">
      <Hero />

      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore out cars you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar setManufacturer={setManufacturer} setModel={setModel} />

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} setFuel={setFuel} />
            <CustomFilter
              title="year"
              options={yearsOfProduction}
              setYear={setYear}
            />
          </div>
        </div>

        <div>
          {allCars.length > 0 ? (
            <section>
              <div className="home__cars-wrapper">
                {allCars?.map((car) => (
                  <CarCard car={car} />
                ))}
              </div>
              {loading && (
                <div className="mt-16 w-full flex-center">
                  <Image
                    src="/loader.svg"
                    alt="loader"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>
              )}
              <ShowMore
                pageNumber={limit / 10}
                isNext={allCars.length >= limit}
                setLimit={setLimit}
              />
            </section>
          ) : (
            <div className="home__error-container">
              <h2 className="text-black text-xl font-bold">Oops, no results</h2>
              <p>{allCars?.message}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
