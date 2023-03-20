import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton } from "../../components/buttons/IconButton";
import { Icon } from "../../components/icons";
import { PrintMonth } from "../../components/prints/month/PrintMonth";

export const PrintMonthView: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <>
      <PrintMonth year={Number.parseInt(params.year!)} month={Number.parseInt(params.month!)} />
      <div className="hide-print fixed top-4 right-4">
        <IconButton onClick={() => navigate(`/years/${params.year}/months/${params.month}/days`)}>
          <Icon.Edit className="hover:text-lime-500" height={24} />
        </IconButton>
      </div>
    </>
  );
};
