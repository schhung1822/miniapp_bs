import React from 'react';

import type { VoteBrand, VoteCategory } from '@/features/beauty-summit/types';
import { normalizeQuery } from '@/features/beauty-summit/utils';
import { TrophyIcon, VoteIcon } from '@/features/beauty-summit/icons';
import VoteCandidateCard from '@/features/beauty-summit/components/VoteCandidateCard';

interface VoteSectionProps {
  voteCategories: VoteCategory[];
  votes: Record<string, string>;
  voteQuery: string;
  onVoteQueryChange: (value: string) => void;
  onToggleVote: (category: VoteCategory, brand: VoteBrand) => void;
  onOpenBrand: (category: VoteCategory, brand: VoteBrand) => void;
}

const VoteSection: React.FC<VoteSectionProps> = ({
  voteCategories,
  votes,
  voteQuery,
  onVoteQueryChange,
  onToggleVote,
  onOpenBrand,
}) => {
  const voteCards = React.useMemo(() => {
    const cards = voteCategories.flatMap((category) =>
      category.brands.map((brand) => ({
        category,
        brand,
        selected: votes[category.id] === brand.id,
        voteCount: brand.voteCount ?? 0,
        rank: brand.rank ?? 0,
      }))
    );

    return cards.sort(
      (left, right) =>
        left.rank - right.rank ||
        right.voteCount - left.voteCount ||
        (left.brand.product || left.brand.name).localeCompare(right.brand.product || right.brand.name)
    );
  }, [voteCategories, votes]);

  const overallVoteCount = React.useMemo(
    () => voteCategories.reduce((sum, category) => sum + (category.totalVotes ?? 0), 0),
    [voteCategories]
  );

  const topThreeVotes = React.useMemo(() => voteCards.slice(0, 3), [voteCards]);

  const query = normalizeQuery(voteQuery);
  const filteredVoteCards = query
    ? voteCards.filter(
        ({ category, brand }) =>
          normalizeQuery(category.title).includes(query) ||
          normalizeQuery(brand.product ?? brand.name).includes(query)
      )
    : voteCards;

  const filteredTopThree = topThreeVotes.filter(
    ({ category, brand }) =>
      !query ||
      normalizeQuery(category.title).includes(query) ||
      normalizeQuery(brand.product ?? brand.name).includes(query)
  );

  return (
    <div className="space-y-5">
      <div className="rounded-[1.45rem] border border-[#eadfd2] bg-[linear-gradient(180deg,#fffdfc_0%,#fdf7ff_100%)] p-4 shadow-[0_14px_28px_rgba(91,74,117,0.08)]">
        <div className="flex">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f5b700,#f97316)] p-2.5 shadow-[0_12px_24px_rgba(245,183,0,0.22)]">
            <TrophyIcon size={24} color="#ffffff" />
          </div>
          <div className="ms-3">
            <div className="bg-[linear-gradient(135deg,#f59e0b,#d946ef)] bg-clip-text pb-1 text-[1.5rem] font-black leading-none text-transparent">
              Bình Chọn
              <br />
              Nhãn Hàng 2026
            </div>
          </div>
        </div>
        <div className="mt-2 text-sm font-medium text-[#7a7280]">
          Tổng: <span className="font-black text-[#8b34ff]">{overallVoteCount}</span> vote
        </div>
        <div className="mt-2 text-sm leading-6 text-[#6f6572]">
          Mỗi tài khoản chỉ được vote 1 sản phẩm duy nhất của thể loại đó.
        </div>
      </div>

      {voteCategories.length > 0 ? (
        <div className="relative">
          <input
            value={voteQuery}
            onChange={(event) => onVoteQueryChange(event.target.value)}
            placeholder="Tìm thể loại hoặc sản phẩm..."
            className="w-full rounded-[1rem] border border-[#eadfd2] bg-white px-4 py-3 text-sm text-[#241629] placeholder:text-[#a69ba8]"
          />
        </div>
      ) : null}

      {voteCategories.length === 0 ? (
        <div className="rounded-[1.1rem] border border-dashed border-[#eadfd2] bg-white px-4 py-6 text-center">
          <div className="text-sm font-semibold text-[#241629]">Chưa có dữ liệu bình chọn</div>
          <div className="mt-1 text-[11px] text-[#8a7e8b]">
            Admin cần tạo vote trong trang quản trị.
          </div>
        </div>
      ) : (
        <>
          {filteredTopThree.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[1.05rem] text-white/90 text-[#2f3b57]">
                <TrophyIcon size={18} color="#f5b700" />
                Top 3 Dẫn đầu
              </div>
              <div className="space-y-3">
                {filteredTopThree.map((item, index) => (
                  <VoteCandidateCard
                    key={`${item.category.id}-${item.brand.id}-top`}
                    category={item.category}
                    brand={item.brand}
                    selected={item.selected}
                    voteCount={item.voteCount}
                    highlight
                    medalNumber={index + 1}
                    onOpenBrand={onOpenBrand}
                    onToggleVote={onToggleVote}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[1.05rem] text-white/90 text-[#2f3b57]">
              <VoteIcon color="#6366f1" size={18} />
              Tất Cả Nhãn Hàng
            </div>
            <div className="space-y-3">
              {filteredVoteCards.length > 0 ? (
                filteredVoteCards.map((item) => (
                  <VoteCandidateCard
                    key={`${item.category.id}-${item.brand.id}-all`}
                    category={item.category}
                    brand={item.brand}
                    selected={item.selected}
                    voteCount={item.voteCount}
                    onOpenBrand={onOpenBrand}
                    onToggleVote={onToggleVote}
                  />
                ))
              ) : (
                <div className="rounded-[1.1rem] border border-dashed border-[#eadfd2] bg-white px-4 py-6 text-center">
                  <div className="text-sm font-semibold text-[#241629]">Không tìm thấy sản phẩm phù hợp</div>
                  <div className="mt-1 text-[11px] text-[#8a7e8b]">
                    Thử đổi từ khóa tìm kiếm để xem danh sách vote.
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VoteSection;
