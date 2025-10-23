"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';


const brandImageMap: Record<string, string> = {
	'urja-wacchi': '/brands/urjaa.jpg',
	'lasoon': '/brands/lasoon.jpeg',
	'radhika': '/brands/radhika fashion.jpg',
	'avangard': '/brands/wachi.jpg',
	'b-52': '/brands/b-52 fashion.jpg',
	'oakberry': '/brands/lasoon feminine.jpg',
	'domex-club': '/brands/e-zennia.jpg',
	'e-zinna': '/brands/e-zennia.jpg',
	'belly-11': '/brands/belly-11.jpg',
	'miss-eney': '/brands/soulwin.jpeg',
	'princy': '/brands/amba jee.jpeg',
	'pampara': '/brands/pampara.jpg',
	'5-rivers': '/brands/5 rivers .jpg',
	'amba-jee': '/brands/amba jee.jpeg',
	'soulwin': '/brands/soulwin.jpeg',
	'sweet-touch': '/brands/sweettouch.png',
};

const PremiumBrandsGrid: React.FC = () => {
	const { state } = useApp();
	const brands = state.brands || [];


       // Brands to show normally
       // Brands to show normally
       const mainBrands = [
	       'urja-wacchi',
	       'lasoon',
	       'soulwin',
	       'amba-jee',
	       'sweet-sister',
		'sweet-touch',
	       'yuvika-fashion',
       ];

       // Fix brand name for J.s.w
       const fixedBrands = brands.map(b => b.id === 'jsur' ? { ...b, name: 'J.s.w' } : b);
       const mainBrandObjs = fixedBrands.filter(b => mainBrands.includes(b.id));
       const comingSoonBrands = fixedBrands.filter(b => !mainBrands.includes(b.id));

       return (
	       <>
		       <div className="mb-10">
			       <h3 className="text-2xl font-bold mb-6 text-gray-900 font-serif">Our Premium Brands</h3>
			       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
				       {mainBrandObjs.map((brand, idx) => {
					       const imageSrc = brandImageMap[brand.id] || brand.image;
					       return (
						       <Card
							       key={brand.id}
							       className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-fade-in-up"
							       style={{ animationDelay: `${idx * 0.05}s` }}
						       >
							       <CardContent className="p-0 flex flex-col h-full">
								       <Link href={`/brands/${brand.id}`} className="block h-full">
									       <div className="relative overflow-hidden rounded-t-xl h-48 sm:h-56">
										       <Image
											       src={imageSrc}
											       alt={brand.name}
											       width={400}
											       height={400}
											       className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 bg-white"
											       unoptimized
										       />
										       <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
										       <div className="absolute bottom-3 left-3 text-white">
											       <h3 className="text-lg font-bold font-serif drop-shadow tracking-wide mb-1">{brand.name}</h3>
											       <div className="flex gap-1 mt-1 flex-wrap">
												       {brand.seasons.map((season: string) => (
													       <span key={season} className="text-[10px] bg-white/30 px-2 py-0.5 rounded-full backdrop-blur border border-white/30 shadow">
														       {season}
													       </span>
												       ))}
											       </div>
										       </div>
									       </div>
								       </Link>
								       <div className="px-4 pb-4 pt-2 mt-auto">
									       <Link href={`/brands/${brand.id}`} className="block w-full">
										       <Button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold shadow hover:scale-105 transition-transform duration-300 rounded-full text-sm py-1.5">
											       Explore
										       </Button>
									       </Link>
								       </div>
							       </CardContent>
						       </Card>
					       );
				       })}
			       </div>
		       </div>
		       <div>
			<div className="flex flex-col items-center justify-center py-10">
				<h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 font-playfair text-gray-800 tracking-tight">
					Coming Soon
				</h2>
				<p className="text-lg md:text-xl text-center text-gray-500 mb-8 font-poppins max-w-2xl">
					Discover exclusive fashion brands for every season,<br />
					curated for retailers who demand quality and style.
				</p>
				<div className="w-16 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full mb-8"></div>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
										{comingSoonBrands
											.filter(brand => !["Princy", "Cute Souls", "Lady Zone", "Miss Eney"].includes(brand.name))
											.map((brand, idx) => {
												let imageSrc = brandImageMap[brand.id] || brand.image;
												// Replace logo for specific brands with provided images
																				if (brand.name === "Avangard") {
																					imageSrc = "/product-images/avangard.jpg";
																				} else if (brand.name === "J.s.w" || brand.name === "JSW" || brand.name === "jsw") {
																					imageSrc = "/product-images/jsw.jpg";
																				} else if (brand.name === "Anika") {
																					imageSrc = "/product-images/anika.jpg";
																				} else if (brand.name === "Domex Club") {
																					imageSrc = "/product-images/domex club.jpg";
																				} else if (brand.name === "Oakberry") {
																					imageSrc = "/product-images/oakberry.jpg";
																				}
												return (
													<Card
														key={brand.id}
														className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-lg opacity-70 transition-all duration-300 overflow-hidden animate-fade-in-up"
														style={{ animationDelay: `${idx * 0.05}s` }}
													>
														<CardContent className="p-0 flex flex-col h-full">
															<div className="relative overflow-hidden rounded-t-xl h-48 sm:h-56">
																<Image
																	src={imageSrc}
																	alt={brand.name}
																	width={400}
																	height={400}
																	className="w-full h-full object-contain transition-transform duration-500 bg-white"
																	unoptimized
																/>
																<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
																<div className="absolute bottom-3 left-3 text-white">
																	<h3 className="text-lg font-bold font-serif drop-shadow tracking-wide mb-1">{brand.name}</h3>
																	<span className="text-xs bg-yellow-400/80 px-2 py-0.5 rounded-full font-semibold ml-2">Coming Soon</span>
																	<div className="flex gap-1 mt-1 flex-wrap">
																		{brand.seasons.map((season: string) => (
																			<span key={season} className="text-[10px] bg-white/30 px-2 py-0.5 rounded-full backdrop-blur border border-white/30 shadow">
																				{season}
																			</span>
																		))}
																	</div>
																</div>
															</div>
															<div className="px-4 pb-4 pt-2 mt-auto">
																<Button className="w-full bg-gray-300 text-gray-600 font-semibold rounded-full text-sm py-1.5 cursor-not-allowed" disabled>
																	Coming Soon
																</Button>
															</div>
														</CardContent>
													</Card>
												);
											})}
						</div>
			</div>
		       </div>
	       </>
       );
};

export default PremiumBrandsGrid;
