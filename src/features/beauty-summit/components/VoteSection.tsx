import React from 'react';

import type { VoteBrand, VoteCategory } from '@/features/beauty-summit/types';
import { normalizeQuery } from '@/features/beauty-summit/utils';
import {
  ChevronRightIcon,
  SearchIcon,
  VoteIcon,
} from '@/features/beauty-summit/icons';
import { apiConfig } from '@/lib/api-client';

interface VoteSectionProps {
  voteCategories: VoteCategory[];
  votes: Record<string, string>;
  voteQuery: string;
  onVoteQueryChange: (value: string) => void;
  onToggleVote: (category: VoteCategory, brand: VoteBrand) => void;
  onOpenBrand: (category: VoteCategory, brand: VoteBrand) => void;
}

const VOTE_IMAGE_PATTERN = /^(data:image\/|https?:\/\/|\/?(avatars|images|public)\/)/i;

const isVoteImage = (value?: string): boolean => VOTE_IMAGE_PATTERN.test(String(value ?? '').trim());

const getAbsoluteImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^(https?:\/\/|data:image\/)/i.test(trimmed)) return trimmed;
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${apiConfig.baseURL}${path}`;
};

const buildVoteFallback = (value: string): string =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

const sortVoteBrands = (brands: VoteBrand[]): VoteBrand[] =>
  [...brands].sort((left, right) => {
    const voteDiff = (right.voteCount ?? 0) - (left.voteCount ?? 0);
    if (voteDiff !== 0) {
      return voteDiff;
    }

    return (left.product || left.name).localeCompare(right.product || right.name, 'vi');
  });

const VoteSection: React.FC<VoteSectionProps> = (props) => {
  const {
    voteCategories,
    votes,
    voteQuery,
    onVoteQueryChange,
    onOpenBrand,
  } = props;

  const query = normalizeQuery(voteQuery);
  const [expandedCategoryIds, setExpandedCategoryIds] = React.useState<string[]>(
    voteCategories[0]?.id ? [voteCategories[0].id] : []
  );

  const filteredCategories = React.useMemo(
    () =>
      voteCategories
        .map((category) => {
          const categoryMatches =
            !query ||
            normalizeQuery(category.title).includes(query) ||
            normalizeQuery(category.desc).includes(query);
          const brands = sortVoteBrands(
            query
              ? category.brands.filter((brand) => {
                  if (categoryMatches) {
                    return true;
                  }

                  return (
                    normalizeQuery(brand.product ?? brand.name).includes(query) ||
                    normalizeQuery(brand.summary ?? '').includes(query)
                  );
                })
              : category.brands
          );

          return {
            category,
            brands,
            displayCount: query ? brands.length : category.brands.length,
          };
        })
        .filter((item) => item.brands.length > 0),
    [query, voteCategories]
  );

  React.useEffect(() => {
    if (filteredCategories.length === 0) {
      setExpandedCategoryIds((previous) => (previous.length === 0 ? previous : []));
      return;
    }

    const availableIds = filteredCategories.map((item) => item.category.id);
    setExpandedCategoryIds((previous) => {
      const next = previous.filter((id) => availableIds.includes(id));

      if (next.length === 0 && previous.length > 0) {
        return [availableIds[0]];
      }

      if (
        next.length === previous.length &&
        next.every((id, index) => id === previous[index])
      ) {
        return previous;
      }

      return next;
    });
  }, [filteredCategories]);

  const renderBrandCard = (category: VoteCategory, brand: VoteBrand): React.ReactNode => {
    const title = brand.product || brand.name;
    const imageUrl = getAbsoluteImageUrl(brand.logo || brand.link);
    const selected = votes[category.id] === brand.id;
    const voteCount = brand.voteCount ?? 0;

    return (
      <button
        key={`${category.id}-${brand.id}`}
        type="button"
        onClick={() => onOpenBrand(category, brand)}
        className="relative mx-auto w-full max-w-[10.75rem] overflow-hidden rounded-[1.05rem] border border-[#f2d4ff] bg-white text-left shadow-[0_14px_26px_rgba(94,8,118,0.18)] transition-transform duration-200 active:scale-[0.985]"
      >
        {selected ? (
          <div className="absolute left-0 top-0 z-[2] rounded-br-[0.95rem] bg-[linear-gradient(135deg,#ff4ec2,#8f3cff)] px-3 text-[0.62rem] font-black uppercase tracking-[0.05em] text-white/90 shadow-[0_8px_18px_rgba(166,34,169,0.28)]">
            Voted
          </div>
        ) : null}
        <div className="absolute right-[-1px] top-[-1px] border border-[#f2d4ff] rounded-bl-[0.95rem] bg-white px-3 py-0.5 shadow-[0_10px_18px_rgba(94,8,118,0.2)]">
          <div className="flex items-end gap-1 text-right leading-none">
            <div className="text-[0.84rem] font-black text-[#65108e]">{voteCount}</div>
            <div className="pb-[1px] text-[0.56rem] font-semibold uppercase tracking-[0.04em] text-[#b34ad7]">
              Vote
            </div>
          </div>
        </div>

        <div className="flex aspect-[0.9] items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#fff8fd_100%)] p-3">
          {imageUrl && isVoteImage(brand.logo || brand.link) ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-contain"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center rounded-[0.95rem] text-[1.15rem] font-black text-white"
              style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}bb)` }}
            >
              {buildVoteFallback(title || 'VT')}
            </div>
          )}
        </div>

        <div className="flex flex-col border-t border-[#f2d4ff] bg-[linear-gradient(135deg,rgba(168,36,199,0.98),rgba(122,19,170,0.98))] px-2.5 py-2.5">
          <div
            className="min-h-[2.05rem] text-center text-[0.8rem] font-semibold leading-[1.1] text-white/90"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {title}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[1.45rem] border border-[#f09de0] bg-[linear-gradient(135deg,rgba(143,23,181,0.98)_0%,rgba(127,20,174,0.98)_56%,rgba(111,17,165,0.98)_100%)] px-4 py-4 shadow-[0_18px_34px_rgba(77,4,108,0.18)]">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-white/14 bg-[linear-gradient(135deg,rgba(255,83,193,0.36)_0%,rgba(161,35,210,0.42)_100%)]">
            <VoteIcon size={24} color="#ffffff" />
          </div>
          <div className="min-w-0">
            <div className="text-[1.1rem] font-black leading-tight text-white/100">
              BÌNH CHỌN NHÃN HÀNG
            </div>
            <div className="mt-1 text-[0.75rem] leading-[1.35] text-white/70">
              Nhấn vào sản phẩm để xem thông tin và bình chọn cho hạng mục bạn yêu thích.
            </div>
          </div>
        </div>
      </div>

      {voteCategories.length > 0 ? (
        <div className="relative">
          <SearchIcon
            size={18}
            color="#000"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
          />
          <input
            value={voteQuery}
            onChange={(event) => onVoteQueryChange(event.target.value)}
            placeholder="Tìm kiếm nhãn hàng..."
            className="w-full rounded-[1rem] border border-[#f3acd9] bg-[linear-gradient(180deg,rgba(255,108,180,0.28)_0%,rgba(213,18,125,0.16)_100%)] py-3 pl-12 pr-4 text-sm text-white placeholder:text-[#000] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
          />
        </div>
      ) : null}

      {voteCategories.length === 0 ? (
        <div className="rounded-[1.25rem] border border-dashed border-[#f09de0] bg-[rgba(128,20,170,0.22)] px-4 py-6 text-center">
          <div className="text-sm font-semibold text-white">Chưa có dữ liệu bình chọn</div>
          <div className="mt-1 text-[11px] text-white/74">
            Admin cần tạo hạng mục và sản phẩm trong trang quản trị.
          </div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-[1.25rem] border border-dashed border-[#f09de0] bg-[rgba(128,20,170,0.22)] px-4 py-6 text-center">
          <div className="text-sm font-semibold text-white">Không tìm thấy hạng mục phù hợp</div>
          <div className="mt-1 text-[11px] text-white/74">
            Thử đổi từ khóa để xem lại danh sách sản phẩm bình chọn.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCategories.map(({ category, brands, displayCount }) => {
            const expanded = expandedCategoryIds.includes(category.id);
            const selectedBrandId = votes[category.id];

            return (
              <div
                key={category.id}
                className="overflow-hidden rounded-[1.35rem] border border-[#f09de0] bg-[linear-gradient(135deg,rgba(136,23,178,0.98)_0%,rgba(125,20,171,0.98)_55%,rgba(111,18,165,0.98)_100%)] shadow-[0_16px_30px_rgba(68,6,109,0.22)]"
              >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCategoryIds((previous) =>
                        previous.includes(category.id)
                          ? previous.filter((id) => id !== category.id)
                          : [...previous, category.id]
                      )
                    }
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                  >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.75rem] border border-white/16 bg-[linear-gradient(135deg,rgba(255,93,197,0.32)_0%,rgba(145,32,202,0.4)_100%)] transition-transform duration-300 ease-out ${
                        expanded ? 'scale-110 shadow-[0_8px_18px_rgba(255,79,194,0.24)]' : 'scale-100'
                      }`}
                    >
                      <ChevronRightIcon
                        size={18}
                        color="#ffffff"
                        className={`transition-transform duration-300 ease-out ${expanded ? 'rotate-90 scale-110' : '-rotate-90 scale-95'}`}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-[1.02rem] font-black leading-tight text-white/90">
                        {category.title}{' '}
                        <span className="font-medium text-white/76">({displayCount})</span>
                      </div>
                      
                    </div>
                  </div>

                  {selectedBrandId ? (
                    <div className="shrink-0 rounded-full border border-white/14 bg-[rgba(255,255,255,0.08)] px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.04em] text-white/86">
                      Đã vote
                    </div>
                  ) : null}
                </button>

                {expanded ? (
                  <div className="border-t border-white/16 px-4 pb-4 pt-3">
                    <div className="grid grid-cols-2 place-items-center gap-3">
                      {brands.map((brand) => renderBrandCard(category, brand))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VoteSection;
