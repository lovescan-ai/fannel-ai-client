import React from "react";
import Card from "./card";
import { ChevronRight, Package } from "lucide-react";
import Button from "./button";

export default function ContactSupport() {
  return (
    <div className="rounded-[22px] mt-4 bg-white border-1 border-brandBlue4x">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl mulish--bold mb-2">Need More?</h2>
        <p className="text-sm text-[#959AA4] mb-4 mulish--bold">
          Customize your plan or get in touch for agency solutions
        </p>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Package className="w-6 h-6 sm:w-10 sm:h-10 text-brandBlue4x flex-shrink-0" />
            <div>
              <h3 className="mulish--regular">Custom Agency Solution</h3>
              <p className="text-sm text-[#959AA4] mulish--bold">
                Tailored for your specific needs
              </p>
            </div>
          </div>
          <Button className="flex rounded-[10px] items-center justify-center w-full sm:w-auto bg-brandBlue4x text-white font-bold h-12 mulish--bold">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
}
